import { Vector2 } from "../backend/math/Vector2"
import { Vector3 } from "../backend/math/Vector3"
import { Vector4 } from "../backend/math/Vector4"
import { ShaderGraph } from "../backend/ShaderGraph"

export class TexRenderer {
    canvas: HTMLCanvasElement
    graph: ShaderGraph | null = null

    constructor() {
        this.canvas = document.createElement("canvas")
    }

    getGlContext() {
        const c = this.canvas.getContext("webgl")
        if (!c) {
            throw new Error("webgl not supported")
        }
        return c
    }


    setSize(w: number, h: number) {
        this.canvas.width = w
        this.canvas.height = h
    }

    setGraph(graph: ShaderGraph) {
        this.graph = graph
    }

    render() {
        if (!this.graph) {
            throw new Error("graph not set")
        }
        // Generate and compile shaders
        const vert = this.graph.vert()
        const frag = this.graph.frag()

        const gl = this.getGlContext()
        const vertShader = gl.createShader(gl.VERTEX_SHADER)!
        gl.shaderSource(vertShader, vert)
        gl.compileShader(vertShader)
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertShader))
            throw new Error("vertex shader compilation failed")
        }

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!
        gl.shaderSource(fragShader, frag)
        gl.compileShader(fragShader)
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragShader))
            throw new Error("fragment shader compilation failed")
        }

        // Setting up the canvas and program
        gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        const program = gl.createProgram()!
        gl.attachShader(program, vertShader)
        gl.attachShader(program, fragShader)
        gl.linkProgram(program)
        gl.useProgram(program)

        // Enable blending for the alpha transparency
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Create a buffer for the square's vertices
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // Define the square's vertices (two triangles forming a square)
        const positions = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0,
        ]);
        // Load the vertices into the buffer
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        // Set up the position attribute
        const positionLocation = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        const texcoords = new Float32Array([
            0.0, 1.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            1.0, 0.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
        const texcoordLocation = gl.getAttribLocation(program, "aUv");
        gl.enableVertexAttribArray(texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        const textures: WebGLTexture[] = []
        Object.entries(this.graph.getUniformValueMap()).forEach(entry => {
            const [name, value] = entry
            if (typeof value === "number") {
                const location = gl.getUniformLocation(program, name)
                gl.uniform1f(location, value)
            }
            if (value instanceof Vector2) {
                const location = gl.getUniformLocation(program, name)
                gl.uniform2f(location, value.x, value.y)
            }
            if (value instanceof Vector3) {
                const location = gl.getUniformLocation(program, name)
                gl.uniform3f(location, value.x, value.y, value.z)
            }
            if (value instanceof Vector4) {
                const location = gl.getUniformLocation(program, name)
                gl.uniform4f(location, value.x, value.y, value.z, value.w)
            }
            if (value instanceof HTMLImageElement) {
                const texture = gl.createTexture()!
                textures.push(texture)
                const level = 0
                const internalFormat = gl.RGBA
                const format = gl.RGBA
                const type = gl.UNSIGNED_BYTE
                gl.bindTexture(gl.TEXTURE_2D, texture)
                gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, value)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            }
        })

        // Clear the canvas with transparent pixels
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Draw the square
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        textures.forEach(texture => {
            gl.deleteTexture(texture)
        })
        gl.deleteBuffer(positionBuffer);
        gl.deleteBuffer(texcoordBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
    }
}
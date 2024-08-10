
export class Vector4 {
    x: number
    y: number
    z: number
    w: number

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    clone() {
        return new Vector4(this.x, this.y, this.z, this.w)
    }
}
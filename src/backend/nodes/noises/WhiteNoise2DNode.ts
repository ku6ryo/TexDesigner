import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class WhiteNoise2DNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Noise_WhiteNoise2D")
    this.addInSocket("v2", ShaderDataType.Vector2)
    this.addOutSocket("o", ShaderDataType.Float)
  }

  generateFragCommonCode(): string {
    return `
float randomWhite2D (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}
`
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    float ${o} = randomWhite2D(${i0});
    `
  }
}

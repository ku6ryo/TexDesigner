import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class WhiteNoiseNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Noise_WhiteNoise", [BuiltIn.UV])
    this.addInSocket("offset", ShaderDataType.Vector2)
    this.addOutSocket("o", ShaderDataType.Float)
  }

  generateFragCommonCode(): string {
    return `
float randomWhite (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}
`
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    float ${o} = randomWhite(vUv + ${i0});
    `
  }
}

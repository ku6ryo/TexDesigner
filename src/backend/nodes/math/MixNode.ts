import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType, ShaderVectorTypes } from "../../data_types"

const SupportedTypes = ShaderVectorTypes.concat([
  ShaderDataType.Float,
  ShaderDataType.Vector2,
  ShaderDataType.Vector3,
  ShaderDataType.Vector4
])
export class MixNode extends ShaderNode {
  #type: ShaderDataType

  constructor(id: string, type: ShaderDataType) {
    if (!SupportedTypes.includes(type)) {
      throw new Error(`Unsupported type: ${type}`)
    }
    super(id, "Math_Mix")
    this.#type = type
    this.addInSocket("in0", type)
    this.addInSocket("in1", type)
    this.addInSocket("in2", ShaderDataType.Float)
    this.addOutSocket("out", type)
  }

  generateFragCode(): string {
    const i0 = this.getInSocket(0).getVarName()
    const i1 = this.getInSocket(1).getVarName()
    const i2 = this.getInSocket(2).getVarName()
    const o = this.getOutSocket(0).getVarName()
    return `
    ${this.#type} ${o} = mix(${i0}, ${i1}, ${i2});
    `
  }
}

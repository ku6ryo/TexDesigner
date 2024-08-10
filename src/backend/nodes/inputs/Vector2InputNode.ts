import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class Vector2InputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "V2Input")
    this.addInSocket("i", ShaderDataType.Vector2)
    this.addOutSocket("o", ShaderDataType.Vector2)
  }

  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `vec2 ${o.getVarName()} = ${i.getVarName()};`
  }
}

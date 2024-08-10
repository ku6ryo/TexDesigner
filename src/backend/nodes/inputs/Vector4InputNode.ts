import { Vector4 } from "../../../backend/math/Vector4"
import { ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class Vector4InputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "V4Input")
    this.addInSocket("i", ShaderDataType.Vector4)
    this.addOutSocket("o", ShaderDataType.Vector4)
  }
  generateFragCommonCode(): string {
    return ""
  }

  generateFragCode(): string {
    const i = this.getInSocket(0)
    const o = this.getOutSocket(0)
    return `vec4 ${o.getVarName()} = ${i.getVarName()};`
  }
}

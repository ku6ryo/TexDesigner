import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class TextureSamplingInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Input_TextureSampling")
    this.addInSocket("is", ShaderDataType.Sampler2D)
    this.addInSocket("iu", ShaderDataType.Vector2)
    this.addOutSocket("o", ShaderDataType.Vector4)
  }

  generateFragCode(): string {
    const iSName = this.getInSocket(0).getUniformVarName()
    const iUName = this.getInSocket(1).getVarName()
    const oType = this.getOutSocket(0).getType()
    const oName = this.getOutSocket(0).getVarName()
    return `${oType} ${oName} = texture2D(${iSName}, ${iUName});`
  }
}

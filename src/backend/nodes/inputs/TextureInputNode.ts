import { BuiltIn, ShaderNode } from "../../ShaderNode"
import { ShaderDataType } from "../../data_types"

export class TextureInputNode extends ShaderNode {
  constructor(id: string) {
    super(id, "Input_Texture", [BuiltIn.UV])
    this.addInSocket("i", ShaderDataType.Sampler2D)
    this.addOutSocket("o", ShaderDataType.Vector4)
  }

  generateFragCode(): string {
    const iName = this.getInSocket(0).getUniformVarName()
    const oType = this.getOutSocket(0).getType()
    const oName = this.getOutSocket(0).getVarName()
    return `${oType} ${oName} = texture2D(${iName}, vUv);`
  }
}

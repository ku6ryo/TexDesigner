import { Vector4 } from "../backend/math/Vector4"
import { NodeTypeId } from "./NodeTypeId"
import { NodeCategory, NodeColor, NodeInputType } from "./types"

export const outputCategory: NodeCategory = {
  id: "output",
  label: "Output",
  icon: "arrow-right",
  color: NodeColor.White,
}

export const outputDefs = [{
  id: NodeTypeId.OutputColor,
  name: "Output",
  category: outputCategory,
  inSockets: [{
    label: "Color",
    alternativeValue: {
      vec4: new Vector4(1, 1, 1, 1),
    },
    alternativeValueInputType: NodeInputType.Color,
  }],
  outSockets: [],
  unique: true,
  deletable: false,
}]

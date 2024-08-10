import { NodeTypeId } from "./NodeTypeId"
import {
  NodeCategory, NodeInputType, NodeColor, NodeDefinition,
} from "./types"
import { Vector2 } from "../backend/math/Vector2"
import { Vector3 } from "../backend/math/Vector3"
import { Vector4 } from "../backend/math/Vector4"

export const inputCategory: NodeCategory = {
  id: "input",
  label: "Input",
  icon: "numerical",
  color: NodeColor.Red,
}

export const inputDefs: NodeDefinition[] = [{
/*
  id: NodeTypeId.InputUv,
  name: "UV",
  category: inputCategory,
  inSockets: [],
  outSockets: [{
    label: "UV",
  }],
}, {
  id: NodeTypeId.InputVertexPosition,
  name: "Vertex Position",
  category: inputCategory,
  inSockets: [],
  outSockets: [{
    label: "Position",
  }],
}, {
  id: NodeTypeId.InputNormal,
  name: "Normal",
  category: inputCategory,
  inSockets: [],
  outSockets: [{
    label: "Normal",
  }],
}, {
  id: NodeTypeId.InputTime,
  name: "Time",
  category: inputCategory,
  inSockets: [{
    label: "time",
    hidden: true,
  }],
  outSockets: [{
    label: "Seconds",
  }],
}, {
  id: NodeTypeId.InputTexture,
  name: "Texture",
  category: inputCategory,
  inSockets: [{
    label: "Image",
    alternativeValueInputType: NodeInputType.Image,
    alternativeValue: {},
    socketHidden: true,
  }],
  outSockets: [{
    label: "Texture",
  }],
}, {
*/
  id: NodeTypeId.InputTextureSampling,
  name: "Texture",
  category: inputCategory,
  inSockets: [{
    label: "Image",
    alternativeValueInputType: NodeInputType.Image,
    alternativeValue: {},
    socketHidden: true,
  }],
  outSockets: [{
    label: "Color",
  }],
}, {
  id: NodeTypeId.InputFloat,
  name: "Float",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Value",
  }],
}, {
  id: NodeTypeId.InputVector2,
  name: "Vector 2",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Vector2,
    alternativeValue: {
      vec2: new Vector2(0, 0),
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Vector",
  }],
}, {
  id: NodeTypeId.InputVector3,
  name: "Vector 3",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Vector3,
    alternativeValue: {
      vec3: new Vector3(0, 0, 0),
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Vector",
  }],
}, {
  id: NodeTypeId.InputVector4,
  name: "Vector 4",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Vector4,
    alternativeValue: {
      vec2: new Vector4(0, 0, 0, 0),
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Vector",
  }],
}, {
  id: NodeTypeId.InputColor,
  name: "Color",
  category: inputCategory,
  inSockets: [{
    label: "Value",
    alternativeValueInputType: NodeInputType.Color,
    alternativeValue: {
      vec4: new Vector4(1, 1, 1, 1),
    },
    socketHidden: true,
  }],
  outSockets: [{
    label: "Color",
  }],
}]

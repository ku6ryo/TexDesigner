import { NodeTypeId } from "./NodeTypeId"
import {
  NodeCategory, NodeColor, NodeDefinition, NodeInputType,
} from "./types"
import { Vector2 } from "../backend/math/Vector2"

export const noiseCategory: NodeCategory = {
  id: "noise",
  label: "Noise",
  icon: "heatmap",
  color: NodeColor.Orange,
}

export const noiseDefs: NodeDefinition[] = [{
  id: NodeTypeId.NoisePerlinNoise,
  name: "Parlin Noise",
  category: noiseCategory,
  inSockets: [{
    label: "Offset",
    alternativeValueInputType: NodeInputType.Vector2,
    alternativeValue: {
      vec2: new Vector2(0, 0),
    },
  }, {
    label: "Scale",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 10,
    },
  }],
  outSockets: [{
    label: "Value",
  }],
}, {
  id: NodeTypeId.NoiseVolonoi,
  name: "Volonoi",
  category: noiseCategory,
  inSockets: [{
    label: "Offset",
    alternativeValueInputType: NodeInputType.Vector2,
    alternativeValue: {
      vec2: new Vector2(0, 0),
    },
  }, {
    label: "Scale",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 10,
    },
  }, {
    label: "Randomness",
    alternativeValueInputType: NodeInputType.Float,
    alternativeValue: {
      float: 1,
    },
  }],
  outSockets: [{
    label: "Distance",
  }],
}, {
  id: NodeTypeId.NoiseWhilteNoise,
  name: "White Noise",
  category: noiseCategory,
  inSockets: [{
    label: "Offset",
    alternativeValueInputType: NodeInputType.Vector2,
    alternativeValue: {
      vec2: new Vector2(0, 0),
    },
  }],
  outSockets: [{
    label: "Value",
  }],
}]

import { mathDefs } from "./math"
import { noiseDefs } from "./noise"
import { inputDefs } from "./input"
import { NodeDefinition } from "./types"

export const definitions = ([] as NodeDefinition[]).concat(
  inputDefs,
  mathDefs,
  noiseDefs,
)

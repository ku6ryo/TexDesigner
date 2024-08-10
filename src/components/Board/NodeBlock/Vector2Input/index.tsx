import { useCallback, memo } from "react"
import { Vector2 } from "../../../../backend/math/Vector2"
import { NodeInputValue } from "../../../../definitions/types"
import { FloatInputBase } from "../FloatInputBase"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void
}

export const Vector2Input = memo(function ({
  value,
  onChange,
}: Props) {
  if (value.vec2 === undefined) {
    throw new Error("value.vec2 is undefined")
  }
  const onChangeInternal = useCallback((part: "x" | "y", f: number) => {
    const v = (() => {
      if (value.vec2 === undefined) {
        throw new Error("value.vec2 is undefined")
      }
      switch (part) {
        case "x":
          return new Vector2(f, value.vec2.y)
        case "y":
          return new Vector2(value.vec2.x, f)
        default:
          throw new Error("unreachable")
      }
    })()
    onChange({
      vec2: v,
    })
  }, [onChange, value])
  return (
    <div>
      <FloatInputBase value={value.vec2.x}
        onChange={
          (v) => {
            onChangeInternal("x", v)
          }
        }
      />
      <FloatInputBase value={value.vec2.y}
        onChange={
          (v) => {
            onChangeInternal("y", v)
          }
        }
      />
    </div>
  )
})
import { useCallback, memo } from "react"
import { Vector4 } from "../../../../backend/math/Vector4"
import { NodeInputValue } from "../../../../definitions/types"
import { FloatInputBase } from "../FloatInputBase"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void
}

export const Vector4Input = memo(function ({
  value,
  onChange,
}: Props) {
  if (value.vec4 === undefined) {
    throw new Error("value.vec4 is undefined")
  }
  const onChangeInternal = useCallback((part: "x" | "y" | "z" | "w", f: number) => {
    const v = (() => {
      if (value.vec4 === undefined) {
        throw new Error("value.vec4 is undefined")
      }
      switch (part) {
        case "x":
          return new Vector4(f, value.vec4.y, value.vec4.z, value.vec4.w)
        case "y":
          return new Vector4(value.vec4.x, f, value.vec4.z, value.vec4.w)
        case "z":
          return new Vector4(value.vec4.x, value.vec4.y, f, value.vec4.w)
        case "w":
          return new Vector4(value.vec4.x, value.vec4.y, value.vec4.z, f)
        default:
          throw new Error("unreachable")
      }
    })()
    onChange({
      vec4: v,
    })
  }, [onChange, value])
  return (
    <div>
      <FloatInputBase value={value.vec4.x}
        onChange={
          (v) => {
            onChangeInternal("x", v)
          }
        }
      />
      <FloatInputBase value={value.vec4.y}
        onChange={
          (v) => {
            onChangeInternal("y", v)
          }
        }
      />
      <FloatInputBase value={value.vec4.z}
        onChange={
          (v) => {
            onChangeInternal("z", v)
          }
        }
      />
      <FloatInputBase value={value.vec4.w}
        onChange={
          (v) => {
            onChangeInternal("w", v)
          }
        }
      />
    </div>
  )
})
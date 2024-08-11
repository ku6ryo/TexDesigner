import {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
  KeyboardEventHandler,
  ChangeEventHandler,
  useEffect
 } from "react"
import style from "./style.module.scss"
import {
  MdKeyboardArrowRight as RightArrowIcon,
  MdKeyboardArrowLeft as LeftArrowIcon
} from "react-icons/md"
import classNames from "classnames"
import { throttle } from "throttle-debounce"

const DELTA = 0.01
const MAX_DECIMAL_PLACES = 5
const MAX_VALUE = Math.pow(10, 10)
const MIN_VALUE = -Math.pow(10, 10)

type Props = {
  value: number,
  onChange: (value: number) => void
}

export function FloatInputBase({
  value,
  onChange,
}: Props) {
  const [typing, setTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [textValue, setTextValue] = useState("")
  const numberAreaRef = useRef<HTMLDivElement | null>(null)
  const isDraggingValueRef = useRef(false)
  const valueRef = useRef(value)
  valueRef.current = value
  const [_, setTimestamp] = useState(0)
  const forceUpdate = useCallback(() => setTimestamp(new Date().getTime()), [])

  const emitOnChange = useCallback((v: number) => {
    if (v > MAX_VALUE) {
      onChange(MAX_VALUE)
      return
    }
    if (v < MIN_VALUE) {
      onChange(MIN_VALUE)
      return
    }
    onChange(Number(v.toFixed(MAX_DECIMAL_PLACES)))
  }, [onChange])

  const throttledEmitOnChange = throttle(100, emitOnChange)
  const throttledEmitOnChangeRef = useRef<throttle<(v: number) => void> | null>(null)
  throttledEmitOnChangeRef.current = throttledEmitOnChange

  useEffect(() => {
    if (!numberAreaRef.current) return
    let mouseIsDown = false
    let mouseDownX = 0
    let valueAtMouseDown = 0

    function mouseMove (e: MouseEvent) {
      if (!mouseIsDown) {
        return
      }
      isDraggingValueRef.current = true
      const delta = e.clientX - mouseDownX
      const v = valueAtMouseDown + delta * DELTA
      throttledEmitOnChangeRef.current?.(v)
    }
    function mouseDown (e: MouseEvent) {
      mouseIsDown = true
      mouseDownX = e.clientX
      valueAtMouseDown = valueRef.current
    }
    function mouseUp (e: MouseEvent) {
      mouseIsDown = false
      if (isDraggingValueRef.current) {
        isDraggingValueRef.current = false
        forceUpdate()
      } else {
        if (e.target === numberAreaRef.current || numberAreaRef.current?.contains(e.target as Node)) {
          setTyping(true)
          if (inputRef.current) {
            inputRef.current.focus()
            setTextValue(valueRef.current.toFixed(5).replace(/\.?0+$/, ""))
          }
        }
      }
    }
    window.document.addEventListener("mousemove", mouseMove)
    window.document.addEventListener("mouseup", mouseUp, { capture: false })
    numberAreaRef.current.addEventListener("mousedown", mouseDown)

    return () => {
      window.document.removeEventListener("mousemove", mouseMove)
      window.document.removeEventListener("mouseup", mouseUp)
      numberAreaRef.current?.removeEventListener("mousedown", mouseDown)
    }
  }, [numberAreaRef, throttledEmitOnChangeRef])

  const onArrowClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const v = Number(e.currentTarget.dataset.value)
    emitOnChange(value + v)
  }, [value, emitOnChange])

  const displayValue = useMemo(() => {
    return value.toFixed(MAX_DECIMAL_PLACES)
  }, [value])

  const onTextInputComplete = useCallback(() => {
    setTyping(false)
    const v = Number(textValue)
    if (isNaN(v)) {
      return
    }
    emitOnChange(v)
  }, [textValue, emitOnChange])

  const onTextInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setTextValue(e.currentTarget.value)
  }, [setTextValue])

  const onInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onTextInputComplete()
  }, [onTextInputComplete])

  const onInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    e.stopPropagation()
    if (e.code === "Enter") {
      onTextInputComplete()
    }
  }, [onTextInputComplete])
  const onInputMouseDown: MouseEventHandler<HTMLInputElement> = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <div className={style.frame}>
      <div
        className={classNames({
          [style.gauge]: true,
          [style.dragging]: isDraggingValueRef.current,
          [style.typing]: typing
        })}
        onMouseDown={e => e.stopPropagation()}
      >
        <div
          className={classNames(style.arrow, style.left)}
          data-value={- DELTA}
          onClick={onArrowClick}
        >
          <LeftArrowIcon />
        </div>
        <div
          className={style.text}
          ref={numberAreaRef}
        >
          <span>{displayValue}</span>
        </div>
        <div
          className={classNames(style.arrow, style.right)}
          data-value={DELTA}
          onClick={onArrowClick}
        >
          <RightArrowIcon />
        </div>
      </div>
      <div
        className={style.inputContainer}
        style={{
          height: typing ? "initial" : "0"
        }}
      >
        <input
          className={style.input}
          value={textValue}
          onBlur={onInputBlur}
          ref={inputRef}
          onMouseDown={onInputMouseDown}
          onKeyDown={onInputKeyDown}
          onChange={onTextInputChange}
        />
      </div>
    </div>
  )
}
import { useRef, MouseEventHandler } from "react"
import { NodeInputValue } from "../../../../definitions/types"
import style from "./style.module.scss"

type Props = {
  value: NodeInputValue,
  onChange: (value: NodeInputValue) => void,
}

export function ImageInput({
  value,
  onChange
}: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const onImageInputRectClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  const onImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ;(async () => {
      const files = e.target.files
      if (files) {
        const file = files.item(0)
        if (file) {
          const arrayBufferView = new Uint8Array(await file.arrayBuffer())
          const blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
          const urlCreator = window.URL || window.webkitURL;
          const imageUrl = urlCreator.createObjectURL( blob );
          const image = new Image()
          image.onload = () => {
            onChange({
              image,
            })
          }
          image.src = imageUrl
        }
      }
    })()
  }
  return (
    <div className={style.frame}>
      <div className={style.imageInputRect} onClick={onImageInputRectClick}>
        {value.image && value.image && (
          <img src={value.image.src}/>
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={onImageInputChange}
        ref={imageInputRef}
        className={style.imageInput}
      />
    </div>
  )
}
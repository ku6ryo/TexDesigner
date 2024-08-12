import { useCallback, useEffect, useRef } from "react"
import { RenderResultManager } from "../../../../utils/RenderResultContext"
import style from "./style.module.scss"

type Props = {
    nodeId: string,
    manager: RenderResultManager
}

export function ResultDisplay({
  nodeId,
  manager,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const callback = (canvas: HTMLCanvasElement) => {
            if (!canvasRef.current) return
            canvasRef.current.width = canvas.width
            canvasRef.current.height = canvas.height
            canvasRef.current.getContext("2d")?.drawImage(canvas, 0, 0)
        }
        manager.addListenr(nodeId, callback)
        return () => {
            manager.removeListener(nodeId, callback)
        }
    }, [])
    const onDownloadClick = useCallback(() => {
        // Let users to download the image.
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const link = document.createElement("a")
        link.download = `${nodeId}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
        link.remove()
    }, [])
    return (
        <div className={style.frame}>
            <div className={style.canvasContainer}>
                <canvas ref={canvasRef} />
            </div>
            <div>
                <button
                    className={style.downloadButton}
                    onClick={onDownloadClick}>Download as PNG
                </button>
            </div>
        </div>
    )
}
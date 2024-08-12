import { useEffect, useState } from "react"
import style from "./style.module.scss"
import packageJson from "../../../package.json"

type Props = {
    onLoadingComplete: () => void
}

const fakeMessages = [
    "Hello",
    "こんにちは",
    "Hola",
    "你好",
    "Bonjour",
    "Loading",
    "Loading.",
    "Loading..",
    "Loading...",
]

const MESSAGE_SWITCH_INTERVAL = 300

export function SplashScreen({ onLoadingComplete }: Props) {

    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        let i = 0
        let interval = setInterval(() => {
           setMessageIndex(i) 
           i++
           if (i >= fakeMessages.length) {
               clearInterval(interval)
               onLoadingComplete()
           }
        }, MESSAGE_SWITCH_INTERVAL)
    }, [])

    return (
        <div className={style.frame}>
            <div className={style.panel}>
                <div className={style.left}>
                    <div className={style.logo}>
                        <img src="/images/logo.png" />
                        <div className={style.text}>Tex Designer</div>
                    </div>
                    <div className={style.paragraph}>
                        <p>&copy; Ryo Kuroyanagi
                            <br/>
                            v{packageJson.version}
                            <br/>
                            <br/>
                            This is a tool inspired by Adobe Substance 3D Designer. You can modify your textures and generate new ones.
                            <br/>
                            <br/>
                            {fakeMessages[messageIndex]}
                        </p>
                    </div>
                </div>
                <div className={style.right}>
                    <img src="/images/splash.png" />
                </div>
            </div>
        </div>
    )
}
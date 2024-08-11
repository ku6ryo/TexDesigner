import { createContext } from "react"



export class RenderResultManager {

    #store = new Map<string, HTMLCanvasElement>()
    #listeners = new Map<string, ((value: HTMLCanvasElement) => void)[]>()

    setResult(key: string, value: HTMLCanvasElement) {
        this.#store.set(key, value)
        this.#listeners.get(key)?.forEach(listener => listener(value))
    }

    addListenr(key: string, listener: (value: HTMLCanvasElement) => void) {
        const listeners = this.#listeners.get(key)
        if (listeners) {
            listeners.push(listener)
            return
        } else {
            this.#listeners.set(key, [listener])
        }
    }

    removeListener(key: string, listener: (value: HTMLCanvasElement) => void) {
        const listeners = this.#listeners.get(key)
        if (listeners) {
            const index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
        }
    }
}

export const renderResultManager = new RenderResultManager()

export const RenderResultContext = createContext(renderResultManager)
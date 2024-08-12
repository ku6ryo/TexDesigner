import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { definitions } from "./definitions";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useMemo, useRef, useState } from "react";
import { CircularReferenceError, IncompatibleSocketConnectionError, ShaderGraph } from "./backend/ShaderGraph";
import { RiNodeTree as NodeIcon } from "react-icons/ri"
import packageJson from "../package.json"
import { Toaster, Position } from "@blueprintjs/core/lib/esm";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css"
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css"
import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import { UniformValueNotSetError } from "./backend/ShaderNode";
import { NodeInputValue } from "./definitions/types";
import { TexRenderer } from "./utils/TexRenderer";
import { throttle } from "throttle-debounce";
import { RenderResultContext, renderResultManager } from "./utils/RenderResultContext";
import { SplashScreen } from "./components/SplashScreen";

/**
 * The root component. 
 */
export function App() {
  const graphRef = useRef<ShaderGraph | null>(null)
  const toasterRef = useRef<Toaster>(null)
  const [invalidWireId, setInvalidaWireId] = useState<string | null>(null)
  const [showSplash, setShowSplash] = useState(true)
  const version = packageJson.version;
  const texRenderer = useMemo(() => {
    const r = new TexRenderer()
    r.setSize(2048, 2048)
    return r
  }, [])
  const throttledRender = throttle(100, () => {
    if (!graphRef.current) {
      return
    }
    const outputNode = graphRef.current.getOutputNode()
    if (!outputNode) {
      return
    }
    texRenderer.render()
    renderResultManager.setResult(outputNode.getId(), texRenderer.canvas)
  })

  const onChange = (nodes: NodeProps[], wires: WireProps[]) => {
    try {
      const graph = createGraphFromInputs(nodes, wires)
      graphRef.current = graph
      setInvalidaWireId(null)
      if (invalidWireId) {
        toasterRef.current?.show({
          message: "Well done!",
          icon: "tick",
          intent: "success",
        })
      }
      texRenderer.setGraph(graph)
      throttledRender()
    } catch (e) {
      console.error(e)
      if (toasterRef.current) {
        if (e instanceof CircularReferenceError) {
          toasterRef.current.show({
            message: "Circular reference",
            intent: "danger",
            icon: "refresh"
          })
          setInvalidaWireId(e.wireId)
          return
        }
        if (e instanceof UniformValueNotSetError) {
          toasterRef.current.show({
            message: e.message,
            intent: "danger",
            icon: "error"
          })
          return
        }
        if (e instanceof IncompatibleSocketConnectionError) {
          toasterRef.current.show({
            message: "Incompatible wire. Socket type mismatch.",
            intent: "danger",
            icon: "disable"
          })
          setInvalidaWireId(e.wireId)
          return
        }
        if (e instanceof Error) {
          toasterRef.current.show({
            message: e.message,
            intent: "danger",
            icon: "error"
          })
          return
        }
        toasterRef.current.show({
          message: "Fatal error: non Error thrown",
          intent: "danger",
          icon: "error"
        })
      }
    }
  }

  const onInSocketValueChange = (nodeId: string, socketIndex: number, value: NodeInputValue) => {
    if (!graphRef.current) {
      return
    }
    const graph = graphRef.current
    if (graph.hasNode(nodeId)) {
      graph.setInputValue(nodeId, socketIndex, value)
      throttledRender()
    }
  }

  const onSplashScreenComplete = () => {
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onLoadingComplete={onSplashScreenComplete}/>}
      <RenderResultContext.Provider value={renderResultManager}>
        <div className={style.logo}>
          <div className={style.title}>Tex Designer&nbsp;<NodeIcon/></div>
          <div className={style.versions}>
            <span>{`v${version}`}</span>
          </div>
        </div>
        <div className={style.board}>
          <Board
            nodeDefinitions={definitions}
            onChange={onChange}
            onInSocketValueChange={onInSocketValueChange}
            invalidWireId={invalidWireId}
          />
        </div>
        <div className={style.help}>
          <div>Help</div>
          <div>Right click: Open menu to add nodes</div>
          <div>Mouse wheel: Zoom</div>
          <div>Wheel press and drag: Pan</div>
          <div>Drag on number input: Increase or decrease value</div>
        </div>
        <Toaster position={Position.BOTTOM} ref={toasterRef} maxToasts={1}/>
      </RenderResultContext.Provider>
    </>
  )
}
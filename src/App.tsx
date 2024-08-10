import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { definitions } from "./definitions";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useEffect, useMemo, useRef, useState } from "react";
import { CircularReferenceError, IncompatibleSocketConnectionError, ShaderGraph } from "./backend/ShaderGraph";
import { RiNodeTree as NodeIcon } from "react-icons/ri"
import packageJson from "../package.json"
import { Toaster, Position } from "@blueprintjs/core/lib/esm";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css"
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css"
import "../node_modules/@blueprintjs/popover2/lib/css/blueprint-popover2.css"
import { UniformValueNotSetError } from "./backend/ShaderNode";
import { NodeInputValue } from "./definitions/types";
import { TexRenderer } from "./TexRenderer";
import { throttle } from "throttle-debounce";

export function App() {

  const graphRef = useRef<ShaderGraph | null>(null)
  const toasterRef = useRef<Toaster>(null)
  const [invalidWireId, setInvalidaWireId] = useState<string | null>(null)
  const version = packageJson.version;
  const outputContainerRef = useRef<HTMLDivElement>(null)
  const texRenderer = useMemo(() => {
    const r = new TexRenderer()
    r.setSize(2048, 2048)
    return r
  }, [])
  const throttledRender = throttle(100, () => texRenderer.render())
  useEffect(() => {
    if (outputContainerRef.current) {
      outputContainerRef.current.appendChild(texRenderer.canvas)
    }
  }, [outputContainerRef.current])

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

  return (
    <>
      <div className={style.sidebar}>
        <div className={style.title}>Tex Designer&nbsp;<NodeIcon/></div>
        <div className={style.versions}>
          <span>{`v${version}`}</span>
        </div>
        <div ref={outputContainerRef} className={style.output}/>
      </div>
      <div className={style.board}>
        <Board
          nodeDefinitions={definitions}
          onChange={onChange}
          onInSocketValueChange={onInSocketValueChange}
          invalidWireId={invalidWireId}
        />
      </div>
      <Toaster position={Position.BOTTOM} ref={toasterRef} maxToasts={1}/>
    </>
  )
}
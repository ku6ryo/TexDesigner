import style from "./App.module.scss";
import { Board } from "./components/Board";
import { NodeProps, WireProps } from "./components/Board/types";
import { definitions } from "./definitions";
import { createGraphFromInputs } from "./backend/createGraphFromInputs";
import { useRef, useState } from "react";
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

export function App() {

  const [graph, setGraph] = useState<ShaderGraph | null>(null)
  const toasterRef = useRef<Toaster>(null)
  const [invalidWireId, setInvalidaWireId] = useState<string | null>(null)
  const version = packageJson.version;

  const onChange = (nodes: NodeProps[], wires: WireProps[]) => {
    try {
      const graph = createGraphFromInputs(nodes, wires)
      setGraph(graph)
      setInvalidaWireId(null)
      if (invalidWireId) {
        toasterRef.current?.show({
          message: "Well done!",
          icon: "tick",
          intent: "success",
        })
      }
      const texRenderer = new TexRenderer()
      texRenderer.setSize(100, 100)
      texRenderer.setGraph(graph)
      texRenderer.render()
      texRenderer.canvas.style.position = "absolute"
      texRenderer.canvas.style.top = "0px"
      texRenderer.canvas.style.left = "0px"
      texRenderer.canvas.style.zIndex = new Date().getTime().toString()
      document.body.appendChild(texRenderer.canvas)
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
    if (graph && graph.hasNode(nodeId)) {
      graph.setInputValue(nodeId, socketIndex, value)
      const texRenderer = new TexRenderer()
      texRenderer.setSize(100, 100)
      texRenderer.setGraph(graph)
      texRenderer.render()
      texRenderer.canvas.style.position = "absolute"
      texRenderer.canvas.style.top = "0px"
      texRenderer.canvas.style.left = "0px"
      texRenderer.canvas.style.zIndex = new Date().getTime().toString()
      document.body.appendChild(texRenderer.canvas)

    }
  }

  return (
    <>
      <div className={style.sidebar}>
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
      <Toaster position={Position.BOTTOM} ref={toasterRef} maxToasts={1}/>
    </>
  )
}
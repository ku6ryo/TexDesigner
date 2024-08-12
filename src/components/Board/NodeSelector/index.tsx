import style from "./style.module.scss"
import { Icon } from "@blueprintjs/core/lib/esm";
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { NodeCategory, NodeDefinition } from "../../../definitions/types";
import { inputCategory } from "../../../definitions/input";
import { mathCategory } from "../../../definitions/math";
import { noiseCategory } from "../../../definitions/noise";

type Props = {
  definitions: NodeDefinition[]
  onSelected: (nodeTypeId: string) => void
}

/**
 * Selector for node types grouped by category. 
 */
export function NodeSelector({
  definitions,
  onSelected,
}: Props) {
  const [categories, nodeMap] = useMemo(() => {
    const nodeMap = new Map<string, NodeDefinition[]>();
    definitions.forEach(def => {
      if (!nodeMap.has(def.category.id)) {
        nodeMap.set(def.category.id, [])
      }
      nodeMap.get(def.category.id)!.push(def)
    })
    return [[inputCategory, mathCategory, noiseCategory], nodeMap]
  }, []);

  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const onCategoryClick: MouseEventHandler<HTMLButtonElement> & ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) = useCallback((e) => {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id!;
    if (selectedCatId === id) {
      setSelectedCatId(null)
    } else {
      setSelectedCatId(e.currentTarget.dataset.id!)
    }
  }, [setSelectedCatId, selectedCatId])

  const onNodeClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation()
    onSelected(e.currentTarget.dataset.id!)
    setSelectedCatId(null)
  }, [onSelected, selectedCatId])

  useEffect(() => {
    const listener = () => {
      if (selectedCatId) {
        setSelectedCatId(null)
      }
    }
    window.addEventListener("click", listener)
    return () => {
      window.removeEventListener("click", listener)
    }
  }, [selectedCatId])

  return (
    <div className={style.frame}>
      {categories.map((c) => {
        return (
          <div key={c.id} onClick={onCategoryClick} data-id={c.id} className={style.category}>
            <Icon icon={c.icon as any} />&nbsp;&nbsp;{c.label}
            {selectedCatId === c.id && (
              <div className={style.nodes}>
                {nodeMap.get(c.id)!.map((n) => {
                  return (
                    <div
                      key={n.id}
                      className={style.node}
                      onClick={onNodeClick}
                      data-id={n.id}
                    >{n.name}</div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
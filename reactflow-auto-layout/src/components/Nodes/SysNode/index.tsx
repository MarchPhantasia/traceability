import "./styles.css";

import { ComponentType, memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { ReactflowNodeData } from "@/data/types";
import { kReactflowLayoutConfig } from "@/components/ControlPanel";

export const SysNode: ComponentType<NodeProps<ReactflowNodeData>> = memo(
  ({ data }) => {
    const { direction, reverseSourceHandles } = kReactflowLayoutConfig.state;
    const isHorizontal = direction === "horizontal";
    const targetHandlesFlexDirection: any = isHorizontal ? "column" : "row";
    const sourceHandlesFlexDirection: any =
      targetHandlesFlexDirection + (reverseSourceHandles ? "-reverse" : "");
    return (
        <div className="react-flow__node-sys">
          <div
            className={`handles handles-${direction} targets`}
            style={{
              flexDirection: targetHandlesFlexDirection,
            }}
          >
            {data.targetHandles.map((id) => (
              <Handle
                className={`handle handle-${direction}`}
                key={id}
                id={id}
                type="target"
                position={isHorizontal ? Position.Left : Position.Top}
              />
            ))}
          </div>
          <div className="label">{data.name}</div>
          <div
            className={`handles handles-${direction} sources`}
            style={{
              flexDirection: sourceHandlesFlexDirection,
            }}
          >
            {data.sourceHandles.map((id) => (
              <Handle
                className={`handle handle-${direction}`}
                key={id}
                id={id}
                type="source"
                position={isHorizontal ? Position.Right : Position.Bottom}
              />
            ))}
          </div>
        </div>
    );
  }
);

SysNode.displayName = "SysNode";

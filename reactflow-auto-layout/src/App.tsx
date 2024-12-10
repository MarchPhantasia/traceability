import "reactflow/dist/style.css";

import { useEffect } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import axios from "axios";
// import { jsonDecode } from "@/utils/base";

import { ControlPanel } from "./components/ControlPanel";
import { kEdgeTypes } from "./components/Edges";
import { ColorfulMarkerDefinitions } from "./components/Edges/Marker";
import { kNodeTypes } from "./components/Nodes";
import { ReactflowInstance } from "./components/ReactflowInstance";
import { workflow2reactflow } from "./data/convert";
import { kDefaultLayoutConfig, ReactflowLayoutConfig } from "./layout/node";
import { useAutoLayout } from "./layout/useAutoLayout";


const EditWorkFlow = () => {
  const [nodes, _setNodes, onNodesChange] = useNodesState([]);
  const [edges, _setEdges, onEdgesChange] = useEdgesState([]);

  const { layout, layouting } = useAutoLayout();

  // const fetchData = async () => {
  //   try {
  //     // 请求节点和边数据
  //     const [nodesResponse, edgesResponse] = await Promise.all([
  //       axios.post("/api/nodes"),
  //       axios.post("/api/edges"),
  //     ]);
  //     // TODO: 手动指定节点的Type为base
  //     /**
  //      *  {
  //           id: "1",
  //           type: "base",
  //           name: "Support for Multi-Task Payload Operations",
  //           content: "The Payload Subsystem shall be capable of running multiple payload tasks simultaneously, including but not limited to image acquisition, communication signal processing, and scientific experiments, while ensuring the independence and data integrity of each task."
  //         },
  //      */
  //     const { nodes: nodes } = nodesResponse.data;
  //     const { edges: edges } = edgesResponse.data;
  //     console.log(nodes, edges)

  //     const res = await axios.post("/api/traceModel")
  //     console.log(res.data)
      
  //     return { nodes, edges };
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     alert("Failed to fetch workflow data.");
  //     return { nodes: [], edges: [] }; // 返回空数据以避免错误
  //   }
  // }

  const fetchData = async () => {
    try {
      // 从 /api/traceModel 接口获取数据
      const res = await axios.post("/api/traceModel");
      const { requirements, traces } = res.data;
  
      // 为每个 requirement 节点添加 type 'base'
      const nodes = requirements.map((node: any) => ({
        ...node,
        type: 'base',
      }));
  
      // 创建一个以节点 name 为键的映射，便于快速查找节点
      const nodeMap = new Map();
      nodes.forEach((node: any) => {
        nodeMap.set(node.name, node);
      });
  
      // 获取当前最大的 id，用于新增节点的 id
      let maxId = nodes.reduce((max: any, node: any) => Math.max(max, Number(node.id)), 0);
  
      // 根据 traces 添加新的节点
      traces.forEach(([sourceName, targetName]: any) => {
        if (!nodeMap.has(targetName)) {
          maxId += 1;
          const newNode = {
            id: maxId.toString(),
            name: targetName,
            content: '',  // content 不需要设置
            type: 'sys',
          };
          nodes.push(newNode);
          nodeMap.set(targetName, newNode);
        }
      });
  
      // 构建 edges 数组
      const edges:any = [];
      const edgeCountMap:any = {}; // 记录每个源节点的边序号
  
      traces.forEach(([sourceName, targetName]: any) => {
        const sourceNode = nodeMap.get(sourceName);
        const targetNode = nodeMap.get(targetName);
  
        if (sourceNode && targetNode) {
          const sourceId = sourceNode.id;
          const targetId = targetNode.id;
  
          if (!edgeCountMap[sourceId]) {
            edgeCountMap[sourceId] = 0;
          } else {
            edgeCountMap[sourceId] += 1;
          }
          const edgeIndex = edgeCountMap[sourceId];
  
          const edge = {
            id: `${sourceId}#${targetId}#${edgeIndex}`,
            source: sourceId,
            target: targetId,
            sourceHandle: `${sourceId}#source#${edgeIndex}`,
            targetHandle: `${targetId}#target#0`,
          };
          edges.push(edge);
        }
      });
  
      return { nodes, edges };
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch workflow data.');
      return { nodes: [], edges: [] }; // 返回空数据以避免错误
    }
  };

  const layoutReactflow = async (
    props: ReactflowLayoutConfig & {
      workflow: string;
    }
  ) => {
    if (layouting) {
      return;
    }
    const defaultWorkflow = await fetchData()
    const workflow = workflow2reactflow(defaultWorkflow);
    await layout({ ...workflow, ...props });
  };

  const notDefaultLayoutConfig: ReactflowLayoutConfig = {
    algorithm: "elk-mr-tree",
    direction: "vertical",
    visibility: "visible",
    spacing: { x: 200, y: 200 },
    reverseSourceHandles: false,
  }

  useEffect(() => {
    const initailize = async () => {
      
      const defaultWorkflow = await fetchData()
      // console.log("defaultWorkflow", defaultWorkflow)
      const { nodes, edges } = workflow2reactflow(defaultWorkflow as any);
      // const reponse = axios.post("/api/nodes");
      layout({ nodes, edges, ...notDefaultLayoutConfig });
    }
    initailize();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ColorfulMarkerDefinitions />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={kNodeTypes}
        edgeTypes={kEdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background id="0" color="#ccc" variant={BackgroundVariant.Dots} />
        <ReactflowInstance />
        <Controls />
        <MiniMap
          pannable
          zoomable
          maskColor="transparent"
          maskStrokeColor="black"
          maskStrokeWidth={10}
        />
        <ControlPanel layoutReactflow={layoutReactflow} />
      </ReactFlow>
    </div>
  );
};

export const WorkFlow = () => {
  return (
    <ReactFlowProvider>
      <EditWorkFlow />
    </ReactFlowProvider>
  );
};

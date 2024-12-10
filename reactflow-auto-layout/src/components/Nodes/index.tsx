import { NodeTypes } from 'reactflow';
import { BaseNode } from './BaseNode';
import { SysNode } from './SysNode';

export const kNodeTypes: NodeTypes = {
  base: BaseNode,
  sys: SysNode,
};

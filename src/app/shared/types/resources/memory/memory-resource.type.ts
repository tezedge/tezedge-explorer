import { MemoryResourceName } from './memory-resource-name.type';

export class MemoryResource {
  name: MemoryResourceName;
  children: MemoryResource[];
  value?: number;
  total?: number;
  color?: string;
}

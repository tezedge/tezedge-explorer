import { DiskResource } from './disk-resource.type';
import { MemoryResource } from './memory-resource.type';
import { CpuResource } from './cpu-resources.type';

export class Resource {
  timestamp: string;
  cpu: CpuResource;
  memory: MemoryResource;
  disk: DiskResource;
}

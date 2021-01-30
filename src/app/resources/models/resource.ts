import { DiskResource } from './disk-resource';
import { MemoryResource } from './memory-resource';
import { CpuResource } from './cpu-resources';

export class Resource {
  timestamp: string;
  cpu: CpuResource;
  memory: MemoryResource;
  disk: DiskResource;
}

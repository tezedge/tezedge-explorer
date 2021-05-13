import { DiskResource } from './disk-resource.type';
import { SystemMemoryResource } from './system-memory-resource.type';
import { CpuResource } from './cpu-resources.type';

export class Resource {
  timestamp: string;
  cpu: CpuResource;
  memory: SystemMemoryResource;
  disk: DiskResource;
}

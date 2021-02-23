export class MemoryResource {
  node: MemoryResourceUsage;
  protocolRunners: MemoryResourceUsage;
  validators: MemoryResourceUsage;
  total: number;
}

export class MemoryResourceUsage {
  virtual: number;
  resident: number;
}

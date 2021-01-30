export class MemoryResource {
  node: MemoryResourceUsage;
  protocolRunners: MemoryResourceUsage;
}

export class MemoryResourceUsage {
  virtual: number;
  resident: number;
}

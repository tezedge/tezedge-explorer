export class StorageBlockDetailsOperationContext {
  data: {
    root: string;
    meanTime: number;
    maxTime: number;
    totalTime: number;
    queriesCount: number;
  };
  mem: number;
  memTree: number;
  find: number;
  findTree: number;
  add: number;
  addTree: number;
  remove: number;
}

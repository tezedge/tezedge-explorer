export class StorageBlockDetailsOperationContext {
  data: {
    root: string;
    meanTime: number;
    maxTime: number;
    totalTime: number;
    actionsCount: number;
  };
  mem: number;
  memTree: number;
  find: number;
  findTree: number;
  add: number;
  addTree: number;
  remove: number;
}

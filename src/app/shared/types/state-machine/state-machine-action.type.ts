export interface StateMachineAction {
  id: number;
  type: string;
  content: any;
  state: any;
  originalId: number;
  datetime: string;
  timeDifference: string;
}

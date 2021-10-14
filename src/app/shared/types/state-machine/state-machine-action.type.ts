export interface StateMachineAction {
  id: number;
  type: string;
  content: any;
  state: any;
  originalId: string;
  datetime: string;
  duration: string;
}

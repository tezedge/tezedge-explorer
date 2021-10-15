export interface StateMachineAction {
  id: number;
  kind: string;
  content: any;
  state: any;
  originalId: string;
  datetime: string;
  duration: string;
}

export interface StateMachineDiagramBlock {
  actionId: number;
  type?: 'info' | 'error';
  status?: 'completed' | 'active' | 'pending';
  actionName: string;
  nextActions: number[];
}

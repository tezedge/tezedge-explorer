export interface StateMachineDiagramBlock {
  actionId: number;
  type?: 'info' | 'error';
  status?: 'completed' | 'active' | 'pending';
  actionKind: string;
  nextActions: number[];
}

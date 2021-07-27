export interface StateMachineDiagramBlock {
  id: number;
  type: 'info' | 'error';
  status: 'completed' | 'active' | 'pending';
  title: string;
  next: number[];
}

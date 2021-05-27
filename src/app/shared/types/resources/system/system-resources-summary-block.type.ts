export class SystemResourcesSummaryBlock {
  name: string;
  value: number;
  color: string;
  label: string;

  constructor(name: string, value: number, color: string, label: string) {
    this.name = name;
    this.value = value;
    this.color = color;
    this.label = label;
  }
}

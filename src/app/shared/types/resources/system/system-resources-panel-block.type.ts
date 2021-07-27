export class SystemResourcesPanelBlock {
  name: string;
  value: number;
  formattingType: string;

  constructor(name: string, value: number, formattingType: string) {
    this.name = name;
    this.value = value;
    this.formattingType = formattingType;
  }
}

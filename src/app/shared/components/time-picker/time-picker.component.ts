import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent implements OnInit {

  @Input() timestamp: number;

  @Output() onSubmit = new EventEmitter<number>();
  @Output() onCancel = new EventEmitter<void>();

  formGroup: FormGroup;

  @ViewChild(MatCalendar, { static: true }) private calendar: MatCalendar<Date>;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const date = new Date(this.timestamp);
    this.calendar.selected = date;
    this.formGroup = this.formBuilder.group({
      date: new FormControl(date),
      hour: new FormControl(),
      minute: new FormControl(),
      second: new FormControl(),
      milliSecond: new FormControl()
    });
  }

  selectedChange(date: Date) {
    this.calendar.selected = date;
  }

  submit(): void {
    const hour = this.formGroup.value.hour ?? 0;
    const minute = this.formGroup.value.minute ?? 0;
    const second = this.formGroup.value.second ?? 0;
    const milliSecond = this.formGroup.value.milliSecond ?? 0;
    const date = this.calendar.selected as Date;

    date.setHours(hour, minute, second, milliSecond);
    this.onSubmit.emit(date.getTime());
  }

  cancel(): void {
    this.onCancel.emit();
  }
}

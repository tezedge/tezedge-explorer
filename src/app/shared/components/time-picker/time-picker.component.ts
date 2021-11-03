import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimePickerComponent implements OnInit {

  @Output() timeChange = new EventEmitter<any>();

  selectedRangeValue: any;

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      date: new FormControl(),
      hour: new FormControl(),
      minute: new FormControl(),
      second: new FormControl(),
      milliSecond: new FormControl()
    });
  }

  selectedChange($event: any) {
    console.log($event);
    this.selectedRangeValue = $event;
  }
}

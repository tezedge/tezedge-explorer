import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsActionComponent } from './logs-action.component';

describe('LogsActionComponent', () => {
  let component: LogsActionComponent;
  let fixture: ComponentFixture<LogsActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

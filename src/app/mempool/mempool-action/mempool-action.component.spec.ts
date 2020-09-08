import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MempoolActionComponent } from './mempool-action.component';

describe('MempoolActionComponent', () => {
  let component: MempoolActionComponent;
  let fixture: ComponentFixture<MempoolActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MempoolActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MempoolActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

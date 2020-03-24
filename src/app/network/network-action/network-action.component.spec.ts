import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { networkActionComponent } from './network-action.component';

describe('networkActionComponent', () => {
  let component: networkActionComponent;
  let fixture: ComponentFixture<networkActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ networkActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(networkActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

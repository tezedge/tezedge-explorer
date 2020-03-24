import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { networkActionDetailComponent } from './network-action-detail.component';

describe('networkActionDetailComponent', () => {
  let component: networkActionDetailComponent;
  let fixture: ComponentFixture<networkActionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ networkActionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(networkActionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

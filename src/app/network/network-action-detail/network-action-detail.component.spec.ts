import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkActionDetailComponent } from './network-action-detail.component';

describe('NetworkActionDetailComponent', () => {
  let component: NetworkActionDetailComponent;
  let fixture: ComponentFixture<NetworkActionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkActionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkActionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

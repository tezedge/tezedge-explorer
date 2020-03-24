import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkActionComponent } from './network-action.component';

describe('NetworkActionComponent', () => {
  let component: NetworkActionComponent;
  let fixture: ComponentFixture<NetworkActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointsActionComponent } from './endpoints-action.component';

describe('EndpointsActionComponent', () => {
  let component: EndpointsActionComponent;
  let fixture: ComponentFixture<EndpointsActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointsActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

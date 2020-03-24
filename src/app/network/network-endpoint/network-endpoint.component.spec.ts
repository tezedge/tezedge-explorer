import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { networkEndpointComponent } from './network-endpoint.component';

describe('networkEndpointComponent', () => {
  let component: networkEndpointComponent;
  let fixture: ComponentFixture<networkEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ networkEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(networkEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

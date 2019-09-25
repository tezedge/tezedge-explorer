import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingEndpointComponent } from './networking-endpoint.component';

describe('NetworkingEndpointComponent', () => {
  let component: NetworkingEndpointComponent;
  let fixture: ComponentFixture<NetworkingEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

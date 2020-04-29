import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointsSearchComponent } from './endpoints-search.component';

describe('EndpointsSearchComponent', () => {
  let component: EndpointsSearchComponent;
  let fixture: ComponentFixture<EndpointsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndpointsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

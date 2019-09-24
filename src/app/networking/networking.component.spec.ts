import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingComponent } from './networking.component';

describe('NetworkingComponent', () => {
  let component: NetworkingComponent;
  let fixture: ComponentFixture<NetworkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

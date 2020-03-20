import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingActionComponent } from './networking-action.component';

describe('NetworkingActionComponent', () => {
  let component: NetworkingActionComponent;
  let fixture: ComponentFixture<NetworkingActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

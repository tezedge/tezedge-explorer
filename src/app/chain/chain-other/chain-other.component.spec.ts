import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainOtherComponent } from './chain-other.component';

describe('ChainOtherComponent', () => {
  let component: ChainOtherComponent;
  let fixture: ComponentFixture<ChainOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

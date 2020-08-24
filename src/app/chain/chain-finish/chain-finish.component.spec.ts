import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainFinishComponent } from './chain-finish.component';

describe('ChainFinishComponent', () => {
  let component: ChainFinishComponent;
  let fixture: ComponentFixture<ChainFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

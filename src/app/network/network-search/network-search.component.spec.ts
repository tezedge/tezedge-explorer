import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { networkSearchComponent } from './network-search.component';

describe('networkSearchComponent', () => {
  let component: networkSearchComponent;
  let fixture: ComponentFixture<networkSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ networkSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(networkSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

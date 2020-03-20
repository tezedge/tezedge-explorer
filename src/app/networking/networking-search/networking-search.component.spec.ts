import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkingSearchComponent } from './networking-search.component';

describe('NetworkingSearchComponent', () => {
  let component: NetworkingSearchComponent;
  let fixture: ComponentFixture<NetworkingSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkingSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

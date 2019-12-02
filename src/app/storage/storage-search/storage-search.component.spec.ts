import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageSearchComponent } from './storage-search.component';

describe('StorageSearchComponent', () => {
  let component: StorageSearchComponent;
  let fixture: ComponentFixture<StorageSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

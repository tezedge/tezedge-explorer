import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StorageSearchComponent } from './storage-search.component';

describe('StorageSearchComponent', () => {
  let component: StorageSearchComponent;
  let fixture: ComponentFixture<StorageSearchComponent>;

  beforeEach(waitForAsync(() => {
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

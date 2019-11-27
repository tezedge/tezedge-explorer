import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageBlockComponent } from './storage-block.component';

describe('StorageBlockComponent', () => {
  let component: StorageBlockComponent;
  let fixture: ComponentFixture<StorageBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

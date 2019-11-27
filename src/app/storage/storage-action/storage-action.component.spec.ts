import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageActionComponent } from './storage-action.component';

describe('StorageActionComponent', () => {
  let component: StorageActionComponent;
  let fixture: ComponentFixture<StorageActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

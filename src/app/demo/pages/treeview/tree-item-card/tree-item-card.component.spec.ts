import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeItemCardComponent } from './tree-item-card.component';

describe('TreeItemCardComponent', () => {
  let component: TreeItemCardComponent;
  let fixture: ComponentFixture<TreeItemCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TreeItemCardComponent]
    });
    fixture = TestBed.createComponent(TreeItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

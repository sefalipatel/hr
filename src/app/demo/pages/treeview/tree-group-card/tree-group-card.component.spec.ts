import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeGroupCardComponent } from './tree-group-card.component';

describe('TreeGroupCardComponent', () => {
  let component: TreeGroupCardComponent;
  let fixture: ComponentFixture<TreeGroupCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TreeGroupCardComponent]
    });
    fixture = TestBed.createComponent(TreeGroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

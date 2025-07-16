import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetCategorySpecificationComponent } from './asset-category-specification.component';

describe('AssetCategorySpecificationComponent', () => {
  let component: AssetCategorySpecificationComponent;
  let fixture: ComponentFixture<AssetCategorySpecificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssetCategorySpecificationComponent]
    });
    fixture = TestBed.createComponent(AssetCategorySpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

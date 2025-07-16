import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssethistorylistComponent } from './assethistorylist.component';

describe('AssethistorylistComponent', () => {
  let component: AssethistorylistComponent;
  let fixture: ComponentFixture<AssethistorylistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssethistorylistComponent]
    });
    fixture = TestBed.createComponent(AssethistorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

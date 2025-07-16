import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetcarrytohomeComponent } from './assetcarrytohome.component';

describe('AssetcarrytohomeComponent', () => {
  let component: AssetcarrytohomeComponent;
  let fixture: ComponentFixture<AssetcarrytohomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssetcarrytohomeComponent]
    });
    fixture = TestBed.createComponent(AssetcarrytohomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

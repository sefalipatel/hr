import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkDocumentComponent } from './bulk-document.component';

describe('BulkDocumentComponent', () => {
  let component: BulkDocumentComponent;
  let fixture: ComponentFixture<BulkDocumentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BulkDocumentComponent]
    });
    fixture = TestBed.createComponent(BulkDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

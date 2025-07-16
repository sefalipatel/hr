import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsuggestionsComponent } from './addsuggestions.component';

describe('AddsuggestionsComponent', () => {
  let component: AddsuggestionsComponent;
  let fixture: ComponentFixture<AddsuggestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddsuggestionsComponent]
    });
    fixture = TestBed.createComponent(AddsuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

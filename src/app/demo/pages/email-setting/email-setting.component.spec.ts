import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSettingComponent } from './email-setting.component';

describe('EmailSettingComponent', () => {
  let component: EmailSettingComponent;
  let fixture: ComponentFixture<EmailSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmailSettingComponent]
    });
    fixture = TestBed.createComponent(EmailSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSettingComponent } from './sms-setting.component';

describe('SmsSettingComponent', () => {
  let component: SmsSettingComponent;
  let fixture: ComponentFixture<SmsSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SmsSettingComponent]
    });
    fixture = TestBed.createComponent(SmsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

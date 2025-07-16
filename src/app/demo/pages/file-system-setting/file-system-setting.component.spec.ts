import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSystemSettingComponent } from './file-system-setting.component';

describe('FileSystemSettingComponent', () => {
  let component: FileSystemSettingComponent;
  let fixture: ComponentFixture<FileSystemSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FileSystemSettingComponent]
    });
    fixture = TestBed.createComponent(FileSystemSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

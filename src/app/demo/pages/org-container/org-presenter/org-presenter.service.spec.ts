import { TestBed } from '@angular/core/testing';

import { OrgPresenterService } from './org-presenter.service';

describe('OrgPresenterService', () => {
  let service: OrgPresenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgPresenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

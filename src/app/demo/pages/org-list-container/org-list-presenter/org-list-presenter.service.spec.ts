import { TestBed } from '@angular/core/testing';

import { OrgListPresenterService } from './org-list-presenter.service';

describe('OrgListPresenterService', () => {
  let service: OrgListPresenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrgListPresenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ManageEntitiesService } from './manage-entities.service';

describe('ManageEntitiesService', () => {
  let service: ManageEntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageEntitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NGXLogger } from './logger.service';

describe('NGXLogger', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NGXLogger]
    });
  });

  it('should ...', inject([NGXLogger], (service: NGXLogger) => {
    expect(service).toBeTruthy();
  }));
});

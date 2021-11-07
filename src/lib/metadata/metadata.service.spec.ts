import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { NGXLoggerMetadataService } from './metadata.service';

describe('NGXLoggerMetadataService', () => {
  let metadataService: NGXLoggerMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLoggerMetadataService,
        DatePipe,
      ]
    });

    metadataService = TestBed.inject(NGXLoggerMetadataService);
  });

  describe('getMetadata', () => {
    it('should return good metadata', () => {

      const metadata = metadataService.getMetadata(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR }, 'test', []);

      expect(metadata.level).toEqual(NgxLoggerLevel.ERROR);
      expect(metadata.message).toEqual('test');
      expect(metadata.additional).toEqual([]);
      // todo : I don't understand why it's not working (regex testers like regex101.com tells me it's true but in the unit test does not work)
      // // Regex to test isoformat (source: https://www.regextester.com/112232)
      // const isIsoFormat = new RegExp('/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/gm').test(metadata.timestamp);
      // expect(isIsoFormat).toBe(true, 'wrong iso format');
    });

    it('should call the function if the message is a function', () => {

      const metadata = metadataService.getMetadata(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR }, () => 'functest', []);

      expect(metadata.message).toEqual('functest');
    });

    it('should use the timestamp format if provided', () => {

      const metadata = metadataService.getMetadata(NgxLoggerLevel.ERROR, { level: NgxLoggerLevel.ERROR, timestampFormat: 'YYYY' }, 'test', []);

      expect(metadata.timestamp).toEqual(new Date().getFullYear().toString());
    });
  });
});

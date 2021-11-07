import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { NGXLoggerMapperService } from './mapper.service';

describe('NGXLoggerMapperService', () => {
  let mapper: NGXLoggerMapperService;
  const proxiedSteps = -2; // This is the number of call that are ignored by calling the mapper directly (instead of using loggerService)

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        NGXLoggerMapperService,
      ]
    });

    mapper = TestBed.inject(NGXLoggerMapperService);
  });

  describe('getLogPosition', () => {
    it('should return good logPosition', (done: DoneFn) => {

      mapper.getLogPosition({ level: NgxLoggerLevel.ERROR, enableSourceMaps: false, proxiedSteps }, { level: NgxLoggerLevel.ERROR, message: 'test' }).subscribe(result => {
        expect(result).toEqual({ fileName: 'mapper.service.spec.ts', lineNumber: 26, columnNumber: 14 });
        done();
      });
    });
  });

  describe('getLogPosition with sourcemap', () => {
    // todo
  });
});

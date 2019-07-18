import { inject, TestBed } from "@angular/core/testing";

import { NGXLogger } from "./logger.service";
import { NGXLoggerHttpService } from "./http.service";
import { NGXLoggerHttpServiceMock } from "../../testing/src/lib/http.service.mock";
import { NGXMapperService } from "./mapper.service";
import { NGXMapperServiceMock } from "../../testing/src/lib/mapper.service.mock";
import { LoggerConfig } from "./logger.config";
import { NgxLoggerLevel } from "./types/logger-level.enum";

describe("NGXLogger", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NGXLogger,
        { provide: NGXLoggerHttpService, useClass: NGXLoggerHttpServiceMock },
        { provide: NGXMapperService, useClass: NGXMapperServiceMock },
        { provide: LoggerConfig, useValue: { level: NgxLoggerLevel.ERROR } }
      ]
    });
  });

  it("should handle circular structures", inject(
    [NGXLogger],
    (logger: NGXLogger) => {
      const a = {
        test: "test"
      };

      a["a"] = a;

      // spyOn(window, 'console');
      spyOn(console, "error");
      spyOn(console, "warn");

      logger.error("warn", a);
      logger.error("test", a);

      expect(console.error).toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
    }
  ));
});

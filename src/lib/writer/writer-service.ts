import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { INGXLoggerMetadata } from '../metadata/imetadata';
import { INGXLoggerConfig } from './../config/iconfig';
import { INGXLoggerWriterService } from './iwriter-service';
import { isPlatformBrowser } from '@angular/common';
import { NgxLoggerLevel } from '../types/logger-level.enum';
import { DEFAULT_COLOR_SCHEME } from './color-scheme';

@Injectable()
export class NGXLoggerWriterService implements INGXLoggerWriterService {

    protected readonly isIE: boolean;
    protected readonly logFunc: (metadata: INGXLoggerMetadata, config: INGXLoggerConfig, metaString: string) => void;

    constructor(
        @Inject(PLATFORM_ID) protected platformId,
    ) {
        this.isIE = isPlatformBrowser(platformId) && navigator && navigator.userAgent &&
            !!(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.userAgent.match(/Trident\//) || navigator.userAgent.match(/Edge\//));

        this.logFunc = this.isIE ? this.logIE.bind(this) : this.logModern.bind(this);
    }

    /** Generate a "meta" string that is displayed before the content sent to the log function */
    protected prepareMetaString(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): string {
        const fileDetails = config.disableFileDetails ? `[${metadata.fileName}:${metadata.lineNumber}:${metadata.columnNumber}]` : '';

        return `${metadata.timestamp} ${NgxLoggerLevel[metadata.level]} ${fileDetails}`;
    }

    /** Get the color to use when writing to console */
    protected getColor(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): string | undefined {
        const configColorScheme = config.colorScheme ?? DEFAULT_COLOR_SCHEME;

        // this is needed to avoid a build error
        if (metadata.level === NgxLoggerLevel.OFF) {
            return undefined;
        }
        return configColorScheme[metadata.level];
    }

    /** Log to the console specifically for IE */
    protected logIE(metadata: INGXLoggerMetadata, config: INGXLoggerConfig, metaString: string): void {

        // Coloring doesn't work in IE

        // make sure additional isn't null or undefined so that ...additional doesn't error
        const additional = metadata.additional || [];

        switch (metadata.level) {
            case NgxLoggerLevel.WARN:
                console.warn(`${metaString} `, metadata.message, ...additional);
                break;
            case NgxLoggerLevel.ERROR:
            case NgxLoggerLevel.FATAL:
                console.error(`${metaString} `, metadata.message, ...additional);
                break;
            case NgxLoggerLevel.INFO:
                console.info(`${metaString} `, metadata.message, ...additional);
                break;
            default:
                console.log(`${metaString} `, metadata.message, ...additional);
        }
    }

    /** Log to the console */
    protected logModern(metadata: INGXLoggerMetadata, config: INGXLoggerConfig, metaString: string): void {
        const color = this.getColor(metadata, config);

        // make sure additional isn't null or undefined so that ...additional doesn't error
        const additional = metadata.additional || [];

        switch (metadata.level) {
            case NgxLoggerLevel.WARN:
                console.warn(`%c${metaString}`, `color:${color}`, metadata.message, ...additional);
                break;
            case NgxLoggerLevel.ERROR:
            case NgxLoggerLevel.FATAL:
                console.error(`%c${metaString}`, `color:${color}`, metadata.message, ...additional);
                break;
            case NgxLoggerLevel.INFO:
                console.info(`%c${metaString}`, `color:${color}`, metadata.message, ...additional);
                break;
            //  Disabling console.trace since the stack trace is not helpful. it is showing the stack trace of
            // the console.trace statement
            // case NgxLoggerLevel.TRACE:
            //   console.trace(`%c${metaString}`, `color:${color}`, message, ...additional);
            //   break;

            case NgxLoggerLevel.DEBUG:
                console.debug(`%c${metaString}`, `color:${color}`, metadata.message, ...additional);
                break;
            default:
                console.log(`%c${metaString}`, `color:${color}`, metadata.message, ...additional);
        }
    }

    /** Write the content sent to the log function to the console */
    public writeMessage(metadata: INGXLoggerMetadata, config: INGXLoggerConfig): void {
        const metaString = this.prepareMetaString(metadata, config);

        this.logFunc(metadata, config, metaString);
    }
}

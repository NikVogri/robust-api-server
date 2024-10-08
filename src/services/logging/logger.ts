import winston from 'winston';
import { AppError } from '../../error/AppError';
import { singleton } from 'tsyringe';
import { Request, Response } from '../../types';

export interface HttpLog {
    success: boolean;
    originalUrl: string;
    path: string;
    client: {
        ip?: string;
        hostname: string;
        version: string;
        userAgent?: string;
    };
    req: {
        query?: object;
        params?: object;
        body?: string[];
    };
    res: {
        statusCode: number;
    };
    error?: {
        message: string;
        errorCode?: string;
        thrownError?: Record<string, unknown>;
    };
}

@singleton()
export class Logger {
    public readonly winston: winston.Logger;

    private readonly custom = {
        levels: {
            error: 0,
            info: 1,
            http: 2,
            verbose: 3,
        },
        colors: {
            error: 'red',
            info: 'yellow',
            http: 'gray',
            verbose: 'gray',
        },
    };

    constructor() {
        winston.addColors(this.custom.colors);
        winston.remove(winston.transports.Console);

        this.winston = winston.createLogger({
            transports: this.getTransports(),
            levels: this.custom.levels,
        });
    }

    private getTransports = (): winston.transports.ConsoleTransportInstance[] => {
        return [
            // Logs appear in STDOUT
            new winston.transports.Console({
                level: 'verbose',
                format: winston.format.combine(
                    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                    winston.format.printf(
                        (i) => `${i.level} ${i.timestamp}: ${i.message} ${JSON.stringify(i.stack) ?? ''}`,
                    ),
                    winston.format.colorize({ all: true }),
                ),
            }),
        ];
    };

    error(message: string, error: Error) {
        this.winston.error(message, AppError.toStringifiableObject(error));
    }

    info(message: string) {
        this.winston.info(message);
    }

    http(req: Request, res: Response, error?: Error) {
        const log = this.buildHttpLog(req, res, error);
        this.winston.http(log);
    }

    private buildHttpLog(req: Request, res: Response, error?: unknown): string {
        return JSON.stringify({
            success: res.statusCode.toString().startsWith('2'), // success status codes are 2xx
            originalUrl: req.originalUrl,
            path: `${req.method} ${req.url}`,
            // TODO: Can also add auth fields in the future
            // user: {}
            client: {
                ip: req.ip,
                hostname: req.hostname,
                version: req.httpVersion,
                userAgent: req.headers['user-agent'],
            },
            req: {
                query: req.query && Object.keys(req.query).length > 0 ? req.query : undefined,
                params: req.params && Object.keys(req.params).length > 0 ? req.params : undefined,
                body: req.body && Object.keys(req.body).length > 0 ? Object.keys(req.body) : undefined,
                // do not log request inputs as they might be too large or contain GDPR data
            },
            res: {
                statusCode: res.statusCode,
                // do not log resposes as they might be too large or contain GDPR data
            },
            error: this.buildErrorObject(error),
        } satisfies HttpLog);
    }

    private buildErrorObject(error?: unknown): HttpLog['error'] {
        if (!error || !(error instanceof Error)) return undefined;

        if (error instanceof AppError) {
            return {
                message: error.message,
                errorCode: error.errorCode,
                thrownError: error.thrownError ? AppError.toStringifiableObject(error.thrownError) : undefined,
            };
        }

        return {
            message: error.message,
            thrownError: AppError.toStringifiableObject(error),
        };
    }
}

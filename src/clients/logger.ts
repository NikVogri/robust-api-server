import { Request, Response } from 'express';
import winston from 'winston';
import { AppError } from '../error/AppError';
import { singleton } from 'tsyringe';

@singleton()
export class Logger {
    private readonly logger: winston.Logger;

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

        this.logger = winston.createLogger({
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

    error(message: string, error: Error, metadata?: Record<string, unknown>) {
        this.logger.error(message, AppError.toStringifiableObject(error), metadata);
    }

    info(message: string, metadata?: Record<string, unknown>) {
        this.logger.info(message, metadata);
    }

    http(req: Request, res: Response, error?: Error) {
        const log = this.buildHttpLog(req, res, error);
        this.logger.http(log);
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
                query: Object.keys(req.query).length > 0 ? req.query : undefined,
                params: Object.keys(req.params).length > 0 ? req.params : undefined,
                body: Object.keys(req.body).length > 0 ? Object.keys(req.body) : undefined,
                // do not log request inputs as they might be too large or contain GDPR data
            },
            res: {
                statusCode: res.statusCode,
                // do not log resposes as they might be too large or contain GDPR data
            },
            error: this.buildErrorObject(error),
        });
    }

    private buildErrorObject(error?: unknown) {
        if (!error || !(error instanceof Error)) return undefined;

        const output: Record<string, unknown> = {
            message: error?.message,
        };

        if (error instanceof AppError && error.thrownError) {
            output['thrown'] = AppError.toStringifiableObject(error.thrownError);
        }

        return output;
    }
}

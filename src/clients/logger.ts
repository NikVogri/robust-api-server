import { Request, Response } from 'express';
import { Service } from 'typedi';
import winston from 'winston';
import { AppError } from '../error/AppError';

@Service()
export class Logger {
    private logger: winston.Logger;

    private custom = {
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

    http(req: Request, res: Response, error?: AppError) {
        const log = this.buildHttpLog(req, res, error);
        this.logger.http(log);
    }

    private buildHttpLog(req: Request, res: Response, error?: AppError): string {
        return JSON.stringify({
            success: res.statusCode.toString().startsWith('2'), // success status codes are 2xx
            url: req.url,
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
                query: req.query,
                body: req.body ? Object.keys(req.body) : undefined,
                // do not log request inputs as they might be too large or contain GDPR data
            },
            res: {
                statusCode: res.statusCode,
                // do not log resposes as they might be too large or contain GDPR data
            },
            error: {
                message: error?.message,
                stack: error?.stack,
                thrown: error?.thrownError ? AppError.toStringifiableObject(error.thrownError) : undefined,
            },
        });
    }
}

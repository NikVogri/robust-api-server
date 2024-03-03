interface IAppError {
    message: string;
    statusCode: number;
    thrownError?: Error | unknown;
    payload?: Record<string, unknown>;
}

export class AppError extends Error {
    thrownError?: Error | unknown;
    statusCode: number;
    payload?: Record<string, unknown>;

    constructor(public data: IAppError) {
        super(data.message);

        this.thrownError = data.thrownError;
        this.statusCode = data.statusCode;
        this.payload = data.payload;
    }

    static toStringifiableObject(error: Error | unknown) {
        if (!(error instanceof Error)) return {};

        const err: Record<string, unknown> = {};

        Object.getOwnPropertyNames(error).forEach((prop) => {
            if ((error[prop as keyof Error] as unknown) instanceof Error) {
                err[prop] = AppError.toStringifiableObject(error);
            } else err[prop] = error[prop as keyof Error];
        });

        return err;
    }
}

type ErrorResult = {
    success: false;
    error: string;
}

type SuccessResult<T> = {
    success: true;
    data: T;
    message?: string
}

export type ResponseResult<T> = SuccessResult<T> | ErrorResult;
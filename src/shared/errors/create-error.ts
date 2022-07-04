export interface IError extends Error {
  statusCode?: number;
}

export const createHTTPException = (status: number, text: string) => {
  const error: IError = new Error(text);
  error.statusCode = status;

  return error;
};

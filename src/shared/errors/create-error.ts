interface IError extends Error {
  status?: number;
}

export const createError = (status: number, text: string) => {
  const error: IError = new Error(text);
  error.status = status;

  return error;
};

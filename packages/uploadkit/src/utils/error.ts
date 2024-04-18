export function catchError<T, U>(func: (...args: U[]) => T, ...args: U[]): string {
  try {
    func(...args);
    return '';
  } catch (error) {
    return (error as Error).message;
  }
}

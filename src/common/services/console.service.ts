
export class ConsoleService {

  static log = (...args: any) => {
    process.env.NODE_ENV !== 'production' && console.log(...args);
  }

  static warning = (...args: any) => {
    process.env.NODE_ENV !== 'production' && console.warn(...args);
  }

  static error = (...args: any) => {
    process.env.NODE_ENV !== 'production' && console.error(...args);
  }
}
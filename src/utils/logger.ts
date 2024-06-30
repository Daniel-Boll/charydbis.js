export class Logger {
  private shouldLog: boolean;

  constructor(private readonly prefix: string) {
    this.shouldLog = process.env.NODE_LOG === "charydbis";
  }

  log(message: string): void {
    if (!this.shouldLog)
      return;

    console.log(`[${this.prefix}] ${message}`);
  }

  error(message: string): void {
    if (!this.shouldLog)
      return;

    console.error(`[${this.prefix}] ${message}`);
  }
}

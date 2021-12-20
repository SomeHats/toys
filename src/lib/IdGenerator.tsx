export class IdGenerator {
  private number = 0;
  constructor(private readonly prefix: string) {}

  next() {
    return `${this.prefix}${this.number++}`;
  }
}

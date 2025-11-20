export interface IHashPasswordProvider {
  hash(pass: string): Promise<string>;
  compare(pass: string, hash: string): Promise<boolean>;
}

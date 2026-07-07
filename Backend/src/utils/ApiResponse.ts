// Every successful response from your API will have the same structure.
export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;

  constructor(message: string, data: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
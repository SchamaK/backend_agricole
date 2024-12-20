import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: {
          code: '900',
          message: message,
        },
        hasError: true,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

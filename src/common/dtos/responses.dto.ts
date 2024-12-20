// response.dto.ts
export class ResponseDto {
    status: {
      code: string;
      message: string;
    };
    count: number;
    hasError: boolean;
    items: any[];
  }
   
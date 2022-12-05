export const notFound = (objectName: string, value: string | number) =>
  `${objectName} '${value}' does not exist`;

export class PaginationResponse {
  data: any;
  index: number;
  size: number;

  constructor(data: any, index: number, size: number) {
    this.data = data;
    this.index = index;
    this.size = size;
  }

}

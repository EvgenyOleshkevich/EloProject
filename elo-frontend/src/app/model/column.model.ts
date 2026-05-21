export interface Column<T = any> {
  key: keyof T;
  title: string;
  //render?: (value: any, row: T) => string //;
  render?: (row: T) => string;
}
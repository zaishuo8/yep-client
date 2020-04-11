export interface PaginationInput {
  pageNo: number;
  pageSize: number;
}

export interface PaginationOutput {
  hasNext: boolean;
  pageNo: number;
  pageSize: number;
  list: any[];
}

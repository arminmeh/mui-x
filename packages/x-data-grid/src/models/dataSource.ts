type RecordId = string | number;
type PaginationParams =
  | {
      page: number;
      pageSize: number;
    }
  | {
      start: number;
      limit: number;
    }
  | {
      cursor: RecordId;
      limit: number;
    };

type Operator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte'; // ... and more
type FilterParamField = {
  [key in Operator]?: string | number | boolean | string[] | number[];
};
type FilterParam = {
  [field: string]: FilterParam[] | FilterParamField | undefined;
  $and?: FilterParam[];
  $or?: FilterParam[];
};

interface DataSourceUpdateParams {
  /**
   * Supports something like
   * filters: {
   *   $and: [{ $or: [{ age: { lt: 20 } }, { age: { gt: 50 } }] }, { name: { eq: 'John' } }],
   * },
   * Retrieves all Jonhs with age lower than 20 or bigger than 50
   */
  filters: FilterParam;
}

interface DataSourceGetParams extends DataSourceUpdateParams {
  pagination: PaginationParams;
  sort: ([string, 'asc' | 'desc'] | string)[];
  groupBy: string[];
}

interface DataSourceResponse<R, M> {
  data: R;
  meta?: M;
  count?: R extends Array<any> ? number : undefined;
}

export interface DataSource<T, M = { [key: string]: any }> {
  get?(params: DataSourceGetParams): Promise<DataSourceResponse<T[], M>>;
  getOne?(id: RecordId): Promise<DataSourceResponse<T, M>>;
  create?(data: Omit<T, 'id'>): Promise<DataSourceResponse<T, M>>;
  update?(params: DataSourceUpdateParams, data: T[]): Promise<DataSourceResponse<T[], M>>;
  updateOne?(id: RecordId, data: Omit<T, 'id'>): Promise<DataSourceResponse<T[], M>>;
  delete?(id: RecordId): Promise<void>;
}

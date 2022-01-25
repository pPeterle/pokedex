export interface ApiResultModel<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

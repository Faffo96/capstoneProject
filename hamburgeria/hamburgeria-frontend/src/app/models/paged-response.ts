export interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    first: boolean;
    last: boolean;
    numberOfElements: number;
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    empty: boolean;
  }
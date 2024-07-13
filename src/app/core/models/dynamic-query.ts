export class Sort {
    field: string;
    dir: string; // asc, desc
  
    constructor(field: string, dir: string) {
      this.field = field;
      this.dir = dir;
    }
  }
  
  export class DynamicQuery {
    sort?: Sort[];
    filter?: Filter;
  
    constructor(sort?: Sort[], filter?: Filter) {
      this.sort = sort;
      this.filter = filter;
    }
  }

export class Filter {
    field: string;
    operator: string; // =, <=, >=, !=, etc.
    value?: string;
    logic?: string; // and, or
    filters?: Filter[];
  
    constructor(field: string, operator: string, value?: string, logic?: string, filters?: Filter[]) {
      this.field = field;
      this.operator = operator;
      this.value = value;
      this.logic = logic;
      this.filters = filters;
    }
  }
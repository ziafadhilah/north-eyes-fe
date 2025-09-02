export interface ChartData {
  data: {
    brands: [
      {
        brand_id: string;
        brand_name: string;
        total_violation: number;
      }
    ];
    total_brands: number;
  };
  message: string;
  status: string;
}

export interface DiagramData {
  data: {
    categories: {
      behaviour: {
        count: number;
        percentage: number;
      };
      grooming: {
        count: number;
        percentage: number;
      };
      strangers: {
        count: number;
        percentage: number;
      };
      uniform: {
        count: number;
        percentage: number;
      };
    };
    total: number;
  };
  message: string;
  status: string;
}

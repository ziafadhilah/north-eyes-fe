export interface BrandData {
  id: number;
  name: string;
  image: string;
  address: string;
  outlet: Array<string>;
  kitchen: Array<{ id: number; name: string }>;
}

export const brandsData: BrandData[] = [
  {
    id: 1,
    name: "Brand A",
    image: "/static/images/ex_brand.png",
    address: "Jl. Antapani",
    outlet: ["Outlet A", "Outlet B", "Outlet C"],
    kitchen: [
      {
        id: 1,
        name: "Kitchen A",
      },
      {
        id: 2,
        name: "Kitchen B",
      },
      {
        id: 3,
        name: "Kitchen C",
      },
    ],
  },
  {
    id: 2,
    name: "Brand B",
    image: "/static/images/ex_brand.png",
    address: "Jl. Antafunky",
    outlet: ["Outlet A", "Outlet B", "Outlet C"],
    kitchen: [
      {
        id: 1,
        name: "Kitchen A",
      },
      {
        id: 2,
        name: "Kitchen B",
      },
      {
        id: 3,
        name: "Kitchen C",
      },
    ],
  },
  {
    id: 3,
    name: "Brand C",
    image: "/static/images/ex_brand.png",
    address: "Jl. Antaantum",
    outlet: ["Outlet A", "Outlet B", "Outlet C"],
    kitchen: [
      {
        id: 1,
        name: "Kitchen A",
      },
      {
        id: 2,
        name: "Kitchen B",
      },
      {
        id: 3,
        name: "Kitchen C",
      },
    ],
  },
];

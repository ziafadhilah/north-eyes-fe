export interface BrandData {
  id: number;
  name: string;
  image: string;
  address: string;
  outlet: Array<{ id: number; name: string }>;
  kitchen: Array<{ id: number; name: string }>;
}

export const brandsData: BrandData[] = [
  {
    id: 1,
    name: "Brand A",
    image: "/static/images/ex_brand.png",
    address: "Jl. Antapani",
    outlet: [
      {
        id: 1,
        name: "Outlet A",
      },
      { id: 2, name: "Outlet B" },
      { id: 1, name: "Outlet C" },
    ],
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
    outlet: [
      {
        id: 1,
        name: "Outlet A",
      },
      { id: 2, name: "Outlet B" },
      { id: 1, name: "Outlet C" },
    ],
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
    outlet: [
      {
        id: 1,
        name: "Outlet A",
      },
      { id: 2, name: "Outlet B" },
      { id: 1, name: "Outlet C" },
    ],
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

export interface Menu {
  id: string;
  name: string;
  icon: React.ReactElement;
  url: string;
}

export const menus: Menu[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <span className="material-symbols-outlined">dashboard</span>,
    url: "/home",
  },
  {
    id: "brand",
    name: "Brand",
    icon: <span className="material-symbols-outlined">shapes</span>,
    url: "/home/brand",
  },
];

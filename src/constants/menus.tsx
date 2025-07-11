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
    url: "/dashboard",
  },
  {
    id: "brand",
    name: "Brand",
    icon: <span className="material-symbols-outlined">shapes</span>,
    url: "/brand",
  },
  {
    id: "slug",
    name: "Slug Management",
    icon: (
      <span className="material-symbols-outlined">familiar_face_and_zone</span>
    ),
    url: "/slug",
  },
  {
    id: "user_management",
    name: "User Management",
    icon: <span className="material-symbols-outlined">manage_accounts</span>,
    url: "/user_management",
  },
  {
    id: "features",
    name: "Features",
    icon: <span className="material-symbols-outlined">empty_dashboard</span>,
    url: "/features",
  },
  {
    id: "registration",
    name: "Customer Register",
    icon: <span className="material-symbols-outlined">group_add</span>,
    url: "/registration",
  },
];

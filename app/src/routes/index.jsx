import HomePage from "@src/pages";
import UserLayout from "@src/components/layouts";
import ProfileLayout from "@src/components/profile/layout";
import HistoryPage from "@src/pages/profile/history";
import AssetsPage from "@src/pages/profile/assets";

export const userRoutes = [
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/profile",
        element: <ProfileLayout />,
        children: [
          {
            path: "/profile/history",
            element: <HistoryPage />,
          },
          {
            path: "/profile/assets",
            element: <AssetsPage />,
          },
        ],
      },
    ],
  },
];

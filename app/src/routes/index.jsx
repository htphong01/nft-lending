import HomePage from "@src/pages";
import ProfilePage from "@src/pages/profile";
import UserLayout from "@src/components/layouts";

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
        element: <ProfilePage />,
      },
    ],
  },
];

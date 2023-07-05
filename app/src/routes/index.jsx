import HomePage from '@src/pages';
import UserLayout from '@src/components/layouts';
import ProfileLayout from '@src/components/profile/layout';
import HistoryPage from '@src/pages/profile/history';
import AssetsPage from '@src/pages/profile/assets';
import CollateralsPage from '@src/pages/profile/collaterals';
import BorrowLayout from '@src/components/borrow/layout';
import BorrowAssetsPage from '@src/pages/borrow/assets';
import BorrowLoansPage from '@src/pages/borrow/loans';
import BorrowOffersPage from '@src/pages/borrow/offers';
import LendLayout from '@src/components/lend/layout';
import LendAssetsPage from '@src/pages/lend/assets';
import LendLoansPage from '@src/pages/lend/loans';
import LendOffersPage from '@src/pages/lend/offers';
import MakeOfferPage from '@src/pages/assets/make-offer';
import LendingPoolLayout from '@src/components/lending-pool/layout';
import LendingPoolPage from '@src/pages/lending-pool';
import LendingPoolRequestsPage from '@src/pages/lending-pool/requests';

export const userRoutes = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <ProfileLayout />,
        children: [
          {
            path: '/profile/history',
            element: <HistoryPage />,
          },
          {
            path: '/profile/assets',
            element: <AssetsPage />,
          },
          {
            path: '/profile/collaterals',
            element: <CollateralsPage />,
          },
        ],
      },
      {
        path: '/borrow',
        element: <BorrowLayout />,
        children: [
          {
            path: '/borrow/assets',
            element: <BorrowAssetsPage />,
          },
          {
            path: '/borrow/loans',
            element: <BorrowLoansPage />,
          },
          {
            path: '/borrow/offers',
            element: <BorrowOffersPage />,
          },
        ],
      },
      {
        path: '/lend',
        element: <LendLayout />,
        children: [
          {
            path: '/lend/assets',
            element: <LendAssetsPage />,
          },
          {
            path: '/lend/loans',
            element: <LendLoansPage />,
          },
          {
            path: '/lend/offers',
            element: <LendOffersPage />,
          },
        ],
      },
      {
        path: '/lending-pool',
        element: <LendingPoolLayout />,
        children: [
          {
            path: '/lending-pool',
            element: <LendingPoolPage />,
          },
          {
            path: '/lending-pool/requests',
            element: <LendingPoolRequestsPage />,
          },
        ],
      },
      {
        path: '/assets/:hash',
        element: <MakeOfferPage />,
      },
    ],
  },
];

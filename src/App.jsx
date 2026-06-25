

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './component/Layout/Layout';
import Home from './component/Home/Home';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import Notfound from './component/Notfound/Notfound';
import './index.css'
import { HeroUIProvider } from "@heroui/react";
import Profile from './component/Profile/Profile';
import UserPage from './component/Profile/UserPage';
import TokenContextProvider from './Context/TokenContext';
import ProtectedInner from './component/ProtectedRoutes/ProtectedInner';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedOuter from './component/ProtectedRoutes/ProtectedOuter';
import PostDetails from './component/PostDetails/PostDetails';
import Settings from './component/Settings/Settings';
import Bookmarks from './component/Bookmarks/Bookmarks';
import Suggestions from './component/Suggestions/Suggestions';
import Notifications from './component/Notifications/Notifications';
const query = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/", element: <Layout />, children: [
          { index: true, element: <ProtectedInner> <Home /></ProtectedInner> },
          { path: "home", element: <ProtectedInner> <Home /></ProtectedInner> },
          { path: "postdetails/:id", element: <ProtectedInner> <PostDetails /></ProtectedInner> },
          { path: "profile", element: <ProtectedInner> <Profile /></ProtectedInner> },
          { path: "profile/:userId", element: <ProtectedInner> <UserPage /></ProtectedInner> },
          { path: "settings", element: <ProtectedInner> <Settings /></ProtectedInner> },
          { path: "bookmarks", element: <ProtectedInner> <Bookmarks /></ProtectedInner> },
          { path: "suggestions", element: <ProtectedInner> <Suggestions /></ProtectedInner> },
          { path: "notifications", element: <ProtectedInner> <Notifications /></ProtectedInner> },
          {
            path: "login", element: <ProtectedOuter><Login /></ProtectedOuter>,
          },
          { path: "register", element: <ProtectedOuter><Register /></ProtectedOuter> },
          { path: "*", element: <Notfound /> },
        ]
      },

    ]
  )
  return (
    <>
      <QueryClientProvider client={query}>

        <TokenContextProvider>

          <HeroUIProvider>

              <RouterProvider router={router}>

              </RouterProvider>
          </HeroUIProvider>
        </TokenContextProvider>
      </QueryClientProvider>
    </>
  )
}

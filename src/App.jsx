

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './component/Layout/Layout';
import Home from './component/Home/Home';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import Notfound from './component/Notfound/Notfound';
import './index.css'
import { HeroUIProvider } from "@heroui/react";
import CounterContextProvider from './Context/CounterContext';
import Profile from './component/Profile/Profile';
import TokenContextProvider from './Context/TokenContext';
import ProtectedInner from './component/ProtectedRoutes/ProtectedInner';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedOuter from './component/ProtectedRoutes/ProtectedOuter';
import PostDetailes from './component/PostDetailes/PostDetailes';
const query = new QueryClient()
export default function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/", element: <Layout />, children: [
          { index: true, element: <ProtectedInner> <Home /></ProtectedInner> },
          { path: "home", element: <ProtectedInner> <Home /></ProtectedInner> },
          { path: "postdetailes/:id", element: <ProtectedInner> <PostDetailes /></ProtectedInner> },
          { path: "profile", element: <ProtectedInner> <Profile /></ProtectedInner> },
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

            <CounterContextProvider>

              <RouterProvider router={router}>

              </RouterProvider>
            </CounterContextProvider>
          </HeroUIProvider>
        </TokenContextProvider>
      </QueryClientProvider>
    </>
  )
}

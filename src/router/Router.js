// ** Router imports
import { lazy } from 'react'

// ** Router imports
import { useRoutes, Navigate } from 'react-router-dom'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout"

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from '../utility/Utils'

// ** GetRoutes
import { getRoutes } from "./routes"

// ** Components
const Login = lazy(() => import('../views/pages/authentication/Login'))
const Landing = lazy(() => import("../views/Landing"))
const Error = lazy(() => import('../views/pages/misc/Error'))
const NotAuthorized = lazy(() => import('../views/pages/misc/NotAuthorized'))
const Article = lazy(() => import('../views/Article'));

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)
  const getHomeRoute = () => {
    const user = getUserData()
    if (user) {
      return getHomeRouteForLoggedInUser(user.role)
    } else {
      return '/login'
    }
  }

  const routes = useRoutes([
    {
      path: '/',
      element: <BlankLayout />,
      children: [
        { path: '/', element: <Landing /> },
        { path: 'article/:id', element: <Article /> } // New route for ArticlePage
      ]
    },
    {
      path: '/home',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/error',
      element: <BlankLayout />,
      children: [{ path: '/error', element: <Error /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    ...allRoutes
  ])

  return routes
}

export default Router

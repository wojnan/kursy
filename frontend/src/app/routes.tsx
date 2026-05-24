import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { CoursePlayer } from './pages/CoursePlayer';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'courses', Component: Courses },
      { path: 'course/:id', Component: CourseDetail },
      { path: 'learn/:id', Component: CoursePlayer },
      { path: 'dashboard', Component: Dashboard },
      { path: 'profile', Component: Profile },
      { path: '*', Component: NotFound },
    ],
  },
]);
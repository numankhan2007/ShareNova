import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import HomePage from '@/pages/Home';
import UploadPage from '@/pages/Upload';
import TextPage from '@/pages/Text';
import RetrievePage from '@/pages/Retrieve';

function RootLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/upload', element: <UploadPage /> },
      { path: '/text', element: <TextPage /> },
      { path: '/retrieve', element: <RetrievePage /> },
    ],
  },
]);

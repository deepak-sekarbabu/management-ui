import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const ClinicPage = lazy(() => import('src/pages/clinic'));
export const DoctorPage = lazy(() => import('src/pages/doctor'));
export const DoctorAbsencePage = lazy(() => import('src/pages/doctorabsence'));
export const QueuePage = lazy(() => import('src/pages/queue'));
export const LoginPage = lazy(() => import('src/pages/login'));

// ----------------------------------------------------------------------

export default function Router() {
    const routes = useRoutes([
        {
            element: (
                <DashboardLayout>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                { element: <IndexPage />, index: true },
                { path: 'user', element: <UserPage /> },
                { path: 'clinic', element: <ClinicPage /> },
                { path: 'doctor', element: <DoctorPage /> },
                { path: 'doctorabsence', element: <DoctorAbsencePage /> },
                { path: 'queue', element: <QueuePage /> },
            ],
        },
        {
            path: 'login',
            element: <LoginPage />,
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ]);

    return routes;
}

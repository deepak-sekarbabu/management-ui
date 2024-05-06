import { Helmet } from 'react-helmet-async';

import { DoctorListPage } from 'src/sections/doctor/view';

// ----------------------------------------------------------------------

export default function DoctorPage() {
    return (
        <>
            <Helmet>
                <title>Doctor Information</title>
            </Helmet>
            <DoctorListPage />
        </>
    );
}

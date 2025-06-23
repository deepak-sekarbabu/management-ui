import { Helmet } from 'react-helmet-async';

import AddPatientAppointmentView from 'src/sections/patient/view/add-patient-appointment-view';

export default function AddPatientAppointmentPage() {
    return (
        <>
            <Helmet>
                <title> Add Patient & Appointment </title>
            </Helmet>
            <AddPatientAppointmentView />
        </>
    );
}

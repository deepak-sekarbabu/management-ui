import { Helmet } from 'react-helmet-async';

import { DoctorAbsencePage } from 'src/sections/doctorabsence';

// ----------------------------------------------------------------------

export default function DoctorsAbsencePage() {
  return (
    <>
      <Helmet>
        <title> Doctor Absence Information </title>
      </Helmet>
      <DoctorAbsencePage />
    </>
  );
}

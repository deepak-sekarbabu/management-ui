import React, { useState } from 'react';

import { Card } from '@mui/material';
import Typography from '@mui/material/Typography';

import data from './data.json';
import DoctorAbsenceCard from './DoctorAbsenceCard';


const DoctorAbsencePage = () => {
    const [doctorAbsence, setDoctorAbsence] = useState([...data]);

    const handleRemove = (id) => {
        setDoctorAbsence(prevDoctorAbsence => prevDoctorAbsence.filter(absence => absence.id !== id));
    };

    return (
        <Card>
            <Typography variant="h1">Doctor Absence Information</Typography>
            {doctorAbsence.map((absence, index) => (
                <DoctorAbsenceCard key={index} absence={absence} onRemove={() => handleRemove(absence.id)} />
            ))}
        </Card>
    );
};

export default DoctorAbsencePage;
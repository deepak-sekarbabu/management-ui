import React, { useState } from 'react';

import { Button } from '@mui/material';

import data from './data.json';
import DoctorCard from './DoctorCard';


const DoctorPage = () => {
    const [doctors, setDoctors] = useState([...data]);
    const [newDoctor, setNewDoctor] = useState(null);

    const addNewDoctor = () => {
        const newDoctorEntry = {
            id: doctors.length + 1, // Assuming ID is based on the current length of the doctors array
            doctorName: 'New Doctor',
            doctorId: '',
            doctorSpeciality: '',
            doctorExperience: 0,
            doctorConsultationFee: 0,
            doctorConsultationFeeOther: 0,
            phoneNumbers: [],
            doctorAvailability: [],
        };
        setNewDoctor(newDoctorEntry);
    };

    const saveNewDoctor = (newDoctorData) => {
        setDoctors([...doctors, newDoctorData]);
        setNewDoctor(null);
    };

    return (
        <div>
            {doctors.map((doctor, index) => (
                <DoctorCard key={index} doctor={doctor} />
            ))}
            {newDoctor && <DoctorCard key={doctors.length} doctor={newDoctor} isNewDoctor onSave={saveNewDoctor} />}
            <Button variant="outlined" style={{ marginTop: '20px' }} onClick={addNewDoctor}>Add Doctor</Button>
        </div>
    );
};

export default DoctorPage;
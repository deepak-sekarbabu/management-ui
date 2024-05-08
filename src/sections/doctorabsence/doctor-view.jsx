import React, { useState } from 'react';

import { Button } from '@mui/material';

import data from './data.json';
import DoctorCard from './DoctorCard';


const DoctorAbsencePage = () => {
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

    const handleRemove = (doctorId) => {
        setNewDoctor(null);
        setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
    };

    const saveNewDoctor = (newDoctorData) => {
        setDoctors([...doctors, newDoctorData]);
        setNewDoctor(null);
    };


    return (
        <div>
            <h1>Doctor Absence Information</h1>
            {doctors.map((doctor, index) => (
                <DoctorCard key={index} doctor={doctor} onRemove={() => handleRemove(doctor.id)} />
            ))}
            {newDoctor && <DoctorCard key={doctors.length} doctor={newDoctor} isNewDoctor onSave={saveNewDoctor} onRemove={handleRemove} />}
            <Button variant="outlined" style={{ marginTop: '20px' }} onClick={addNewDoctor}>Add Doctor</Button>
        </div>
    );
};

export default DoctorAbsencePage;
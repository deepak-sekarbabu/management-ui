import React, { useState } from 'react';

import { Box, Card, Button, Typography } from '@mui/material';

import data from './data.json';
import DoctorCard from './DoctorCard';


const DoctorPage = () => {
    const [doctors, setDoctors] = useState([...data]);
    const [newDoctor, setNewDoctor] = useState(null);

    const addNewDoctor = () => {
        const newDoctorEntry = {
            id: doctors.length + 1,
            doctorName: '',
            doctorId: '',
            doctorSpeciality: '',
            doctorExperience: 0,
            doctorConsultationFee: 0,
            doctorConsultationFeeOther: 0,
            phoneNumbers: [{
                "phoneNumber": ""
            }],
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
        <Card>
            <Box p={2}>
                <Typography variant="h2">Doctor Information</Typography>
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} onRemove={() => handleRemove(doctor.id)} />
                ))}
                {newDoctor && (
                    <DoctorCard key={`new-${doctors.length}`} doctor={newDoctor} isNewDoctor onSave={saveNewDoctor} onRemove={handleRemove} />
                )}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="outlined" onClick={addNewDoctor}>Add Doctor</Button>
                </Box>
            </Box>
        </Card>
    );
};

export default DoctorPage;
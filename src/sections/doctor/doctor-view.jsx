import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';

import { Box, Card, Button, Typography } from '@mui/material';

//  import data from './data.json';
import DoctorCard from './DoctorCard';
// Fetch data from the specified URL
const fetchData = async () => {
    const response = await fetch('api/clinic/doctorinformation/1');
    if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
    }
    return response.json();
};

const DoctorPage = () => {
    const [doctors, setDoctors] = useState([]); // Initialize as an empty array
    const [newDoctor, setNewDoctor] = useState(null);

    useEffect(() => {
        fetchData().then((data) => setDoctors(data)); // Fetch data and update state
    }, []); // Empty dependency array means this effect runs once on mount

    const addNewDoctor = () => {
        const newDoctorEntry = {
            id: uuidv4(),
            doctorName: '',
            doctorId: '',
            doctorSpeciality: '',
            doctorExperience: 0,
            doctorConsultationFee: 0,
            doctorConsultationFeeOther: 0,
            phoneNumbers: [{ phoneNumber: '' }],
            doctorAvailability: [
                {
                    availableDays: '',
                    shiftTime: '',
                    shiftStartTime: '',
                    shiftEndTime: '',
                    consultationTime: 0,
                    configType: '',
                },
            ],
        };
        setNewDoctor(newDoctorEntry);
    };

    const handleRemove = (doctorId) => {
        console.log('Removing doctor Data:', doctorId);
        setNewDoctor(null);
        setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
    };

    const saveNewDoctor = async (newDoctorData) => {
        console.log('newDoctorData:', newDoctorData);
        try {
            // Explicitly set the 'clinicId' field to 1
            newDoctorData.clinicId = 1;
            // Exclude the 'id' property from newDoctorData
            const dataWithoutId = Object.keys(newDoctorData).reduce((acc, key) => {
                if (key !== 'id') {
                    acc[key] = newDoctorData[key];
                }
                return acc;
            }, {});
            const response = await fetch('api/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataWithoutId), // Use the modified object without 'id'
            });
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            setDoctors([...doctors, newDoctorData]);
            setNewDoctor(null);
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    return (
        <Card>
            <Box p={2}>
                <Typography variant="h2">Doctor Information</Typography>
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onRemove={() => handleRemove(doctor.id)}
                    />
                ))}
                {newDoctor && (
                    <DoctorCard
                        key={`new-${doctors.length}`}
                        doctor={newDoctor}
                        isNewDoctor
                        onSave={saveNewDoctor}
                        onRemove={handleRemove}
                    />
                )}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="outlined" onClick={addNewDoctor}>
                        Add Doctor
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default DoctorPage;

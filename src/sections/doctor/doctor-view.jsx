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
        console.log('saving doctor:', newDoctorData);
        try {
            // Check if the doctor is new or not
            console.log(newDoctorData.id);
            console.log(Number.isInteger(newDoctorData.id));
            if (Number.isInteger(newDoctorData.id)) {
                console.log("Existing Doctor Flow");
                // If the doctor is not new, make a PUT call
                const response = await fetch(`api/doctor/${newDoctorData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newDoctorData),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                console.log('Doctor updated successfully');
            } else {
                console.log("New Doctor Flow");
                // If the doctor is new, proceed with the POST call
                // Ensure the ID field is not included in the request body
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
                    body: JSON.stringify(dataWithoutId),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error status: ${response.status}`);
                }
                // After successfully saving or updating, reload the data
                fetchData().then((data) => setDoctors(data));
                setDoctors([...doctors, newDoctorData]);
                setNewDoctor(null);
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
        // After successfully saving or updating, reload the data
        fetchData().then((data) => setDoctors(data));
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
                        onSave={saveNewDoctor}
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

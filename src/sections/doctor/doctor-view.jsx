import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';

import { Box, Card, Stack, Button, Container, Typography, CircularProgress } from '@mui/material';

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
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchData();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    if (isLoading) {
        return (
            <Container>
                <Stack
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                >
                    <Typography variant="h2" gutterBottom>
                        Doctor Information
                    </Typography>
                </Stack>
                <CircularProgress
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            </Container>
        );
    }

    const addNewDoctor = () => {
        const newDoctorEntry = {
            id: uuidv4(),
            doctorName: '',
            doctorId: '',
            clinicId: 1,
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
            languagesSpoken: [],
            qualifications: [],
        };
        setNewDoctor(newDoctorEntry);
    };

    const handleRemove = async (doctorId) => {
        console.log('Removing doctor Data:', doctorId);
        try {
            if (typeof doctorId === 'string' && doctorId.includes('-')) {
                setNewDoctor(null);
                setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
            }
            const response = await fetch(`api/doctor/${doctorId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            console.log('Doctor removed successfully');
            setNewDoctor(null);
            setDoctors(doctors.filter((doctor) => doctor.id !== doctorId));
        } catch (error) {
            console.error('Error removing doctor:', error);
        }
    };

    const saveNewDoctor = async (newDoctorData) => {
        try {
            let response;
            if (typeof newDoctorData.id === 'string' && newDoctorData.id.includes('-')) {
                // New doctor (UUID)
                const dataWithoutId = Object.keys(newDoctorData).reduce((acc, key) => {
                    if (key !== 'id') {
                        acc[key] = newDoctorData[key];
                    }
                    return acc;
                }, {});
                console.log('Adding new Doctor', dataWithoutId);
                response = await fetch('api/doctor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataWithoutId),
                });
            } else {
                // Existing doctor
                console.log('Updating existing  Doctor : id', newDoctorData, newDoctorData.id);
                response = await fetch(`api/doctor/${newDoctorData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newDoctorData),
                });
            }
            if (!response.ok) {
                throw new Error(`HTTP error status: ${response.status}`);
            }
            console.log('Doctor saved successfully');
            await loadData();
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
                    <Button variant="contained" color="primary" onClick={addNewDoctor}>
                        Add Doctor
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default DoctorPage;

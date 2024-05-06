import axios from 'axios';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Avatar from '@mui/material/Avatar';
import {
    Paper,
    Table,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TableContainer,
} from '@mui/material';

const DoctorListPage = () => {
    const [doctors, setDoctors] = useState([]);
    const history = useHistory();
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('/api/doctor-clinic/1');
                console.log(response.data);
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorClick = async (doctorId) => {
        console.log(doctorId);
        history.push(`/doctor/${doctorId}`);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Doctor Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {doctors.map((doctor, index) => (
                        <TableRow
                            key={doctor.doctorId}
                            onClick={() => handleDoctorClick(doctor.doctorId)}
                        >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                                <Avatar
                                    alt={doctor.doctorName}
                                    src={`/assets/images/avatars/avatar_${index + 1}.jpg`}
                                />
                                {doctor.doctorName}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DoctorListPage;

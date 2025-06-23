import { useState } from 'react';

import { Box, Stack, Button, MenuItem, TextField, Typography } from '@mui/material';

const slots = [
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '11:30 - 12:00',
];

export default function AddPatientAppointmentView() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        symptoms: '',
        slot: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now, just log the form data
        // Replace with API call as needed
        // eslint-disable-next-line no-console
        console.log('Patient Appointment:', form);
        alert('Patient and appointment added!');
        setForm({ name: '', phone: '', symptoms: '', slot: '' });
    };

    return (
        <Box
            maxWidth={400}
            mx="auto"
            mt={5}
            p={3}
            boxShadow={3}
            borderRadius={2}
            bgcolor="background.paper"
        >
            <Typography variant="h5" mb={2} align="center">
                Add Patient & Appointment
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        label="Patient Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        fullWidth
                        type="tel"
                        inputProps={{ pattern: '[0-9]{10,15}' }}
                    />
                    <TextField
                        label="Symptoms"
                        name="symptoms"
                        value={form.symptoms}
                        onChange={handleChange}
                        required
                        fullWidth
                        multiline
                        minRows={2}
                    />
                    <TextField
                        select
                        label="Choose Slot"
                        name="slot"
                        value={form.slot}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        {slots.map((slot) => (
                            <MenuItem key={slot} value={slot}>
                                {slot}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Add Appointment
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}

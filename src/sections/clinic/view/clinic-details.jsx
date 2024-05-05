import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Card, TextField, Typography, CardContent } from '@mui/material';

export function ClinicDetails({ clinic }) {
    const [editMode, setEditMode] = useState(false);
    const [formValues, setFormValues] = useState(clinic);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        // Update the data with formValues
        setEditMode(false);
    };

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    return (
        <Card>
            <CardContent>
                <TextField
                    name="clinicName"
                    label="Clinic Name"
                    value={formValues.clinicName}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicAddress"
                    label="Clinic Address"
                    value={formValues.clinicAddress}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicPinCode"
                    label="Clinic Pin Code"
                    value={formValues.clinicPinCode}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />

                <div>
                    <Typography variant="body2">
                        Phone Numbers:{' '}
                        {formValues.clinicPhoneNumbers.map((phone) => phone.phoneNumber).join(', ')}
                    </Typography>
                </div>

                <TextField
                    name="clinicEmail"
                    label="Clinic Email"
                    value={formValues.clinicEmail}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicWebsite"
                    label="Clinic Website"
                    value={formValues.clinicWebsite}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicTimings"
                    label="Clinic Timings"
                    value={formValues.clinicTimings}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicAmenities"
                    label="Clinic Amenities"
                    value={formValues.clinicAmenities}
                    onChange={handleChange}
                    disabled={!editMode}
                    fullWidth
                    margin="normal"
                />
            </CardContent>
        </Card>
    );
}

ClinicDetails.propTypes = {
    clinic: PropTypes.shape({
        clinicName: PropTypes.string.isRequired,
        clinicAddress: PropTypes.string.isRequired,
        clinicPinCode: PropTypes.string.isRequired,
        clinicPhoneNumbers: PropTypes.arrayOf(
            PropTypes.shape({
                phoneNumber: PropTypes.string.isRequired,
            })
        ).isRequired,
        clinicEmail: PropTypes.string.isRequired,
        clinicTimings: PropTypes.string.isRequired,
        clinicWebsite: PropTypes.string.isRequired,
        clinicAmenities: PropTypes.string.isRequired,
    }).isRequired,
};

export default ClinicDetails;

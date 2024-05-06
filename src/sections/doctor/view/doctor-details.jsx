import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Card, Stack, TextField, CardContent } from '@mui/material';

function DoctorDetails({ clinic, isEditable, onFormValuesChange }) {
    const [formValues, setFormValues] = useState(clinic);

    const handleChangePhoneNumber = (e, index) => {
        const { value } = e.target;
        const updatedPhoneNumbers = [...formValues.clinicPhoneNumbers];
        updatedPhoneNumbers[index] = { ...updatedPhoneNumbers[index], phoneNumber: value };
        setFormValues({ ...formValues, clinicPhoneNumbers: updatedPhoneNumbers });
        onFormValuesChange({ ...formValues, clinicPhoneNumbers: updatedPhoneNumbers });
    };

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
        onFormValuesChange({ ...formValues, [e.target.name]: e.target.value });
    };

    return (
        <Card>
            <CardContent>
                <TextField
                    name="clinicName"
                    label="Clinic Name"
                    value={formValues.clinicName}
                    onChange={handleChange}
                    disabled
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicAddress"
                    label="Clinic Address"
                    value={formValues.clinicAddress}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicPinCode"
                    label="Clinic Pin Code"
                    value={formValues.clinicPinCode}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                />

                <Stack spacing={2}>
                    {formValues.clinicPhoneNumbers.map((phone, index) => (
                        <TextField
                            key={index}
                            name={`clinicPhoneNumbers[${index}].phoneNumber`}
                            value={phone.phoneNumber}
                            onChange={(e) => handleChangePhoneNumber(e, index)}
                            label={`Phone Number ${index + 1}`}
                            disabled={!isEditable}
                            variant="outlined"
                        />
                    ))}
                </Stack>

                <TextField
                    name="clinicEmail"
                    label="Clinic Email"
                    value={formValues.clinicEmail}
                    onChange={handleChange}
                    disabled
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicWebsite"
                    label="Clinic Website"
                    value={formValues.clinicWebsite}
                    onChange={handleChange}
                    disabled
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicTimings"
                    label="Clinic Timings"
                    value={formValues.clinicTimings}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    name="clinicAmenities"
                    label="Clinic Amenities"
                    value={formValues.clinicAmenities}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                />
            </CardContent>
        </Card>
    );
}

DoctorDetails.propTypes = {
    isEditable: PropTypes.bool.isRequired,
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
    onFormValuesChange: PropTypes.func.isRequired,
};

export default DoctorDetails;

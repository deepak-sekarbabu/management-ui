import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Card, Stack, TextField, CardContent } from '@mui/material';

function ClinicDetails({ clinic, isEditable, onFormValuesChange }) {
    const [formValues, setFormValues] = useState(clinic);
    const [phoneNumberErrors, setPhoneNumberErrors] = useState([]);
    const [emailError, setEmailError] = useState(false);
    const [websiteError, setWebsiteError] = useState(false);
    const [timingsError, setTimingsError] = useState(false);
    const [amenitiesError, setAmenitiesError] = useState(false);

    const handleChangePhoneNumber = (e, index) => {
        const { value } = e.target;
        const updatedPhoneNumbers = [...formValues.clinicPhoneNumbers];
        const isValid = validatePhoneNumber(value);
        updatedPhoneNumbers[index] = { ...updatedPhoneNumbers[index], phoneNumber: value };
        setFormValues({ ...formValues, clinicPhoneNumbers: updatedPhoneNumbers });
        onFormValuesChange({ ...formValues, clinicPhoneNumbers: updatedPhoneNumbers });
        setPhoneNumberErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = !isValid;
            return newErrors;
        });
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\+91\d{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        // Validate input fields
        switch (name) {
            case 'clinicName':
                updatedValue = value.slice(0, 150);
                break;
            case 'clinicAddress':
                updatedValue = value.slice(0, 200);
                break;
            case 'clinicPinCode':
                updatedValue = value.slice(0, 10);
                break;
            case 'clinicEmail':
                updatedValue = value.slice(0, 120);
                setEmailError(updatedValue.length > 120);
                break;
            case 'clinicTimings':
                updatedValue = value.slice(0, 150);
                setTimingsError(updatedValue.length > 149);
                break;
            case 'clinicWebsite':
                updatedValue = value.slice(0, 150);
                setWebsiteError(updatedValue.length > 149);
                break;
            case 'clinicAmenities':
                updatedValue = value.slice(0, 150);
                setAmenitiesError(updatedValue.length > 149);
                break;
            default:
                break;
        }

        setFormValues({ ...formValues, [name]: updatedValue });
        onFormValuesChange({ ...formValues, [name]: updatedValue });
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    let emailHelperText = '';
    if (!isValidEmail(formValues.clinicEmail)) {
        emailHelperText = 'Invalid email address';
    } else if (emailError) {
        emailHelperText = 'Clinic Email should not exceed 120 characters';
    }

    let websiteHelperText = '';
    if (websiteError) {
        websiteHelperText = 'Clinic Website should not exceed 149 characters';
    }

    let timingsHelperText = '';
    if (timingsError) {
        timingsHelperText = 'Clinic Timings should not exceed 149 characters';
    }

    let amenitiesHelperText = '';
    if (amenitiesError) {
        amenitiesHelperText = 'Clinic Amenities should not exceed 149 characters';
    }

    return (
        <Card>
            <CardContent>
                <TextField
                    name="clinicName"
                    label="Clinic Name"
                    value={formValues.clinicName}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={formValues.clinicName.length > 149}
                    helperText={
                        formValues.clinicName.length > 149
                            ? 'Clinic Name should not exceed 149 characters'
                            : ''
                    }
                />

                <TextField
                    name="clinicAddress"
                    label="Clinic Address"
                    value={formValues.clinicAddress}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={formValues.clinicAddress.length > 199}
                    helperText={
                        formValues.clinicAddress.length > 199
                            ? 'Clinic Address should not exceed 199 characters'
                            : ''
                    }
                />

                <TextField
                    name="clinicPinCode"
                    label="Clinic Pin Code"
                    value={formValues.clinicPinCode}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={!/^\d+$/.test(formValues.clinicPinCode)}
                    helperText={
                        !/^\d+$/.test(formValues.clinicPinCode)
                            ? 'Clinic Pin Code should contain only numbers'
                            : ''
                    }
                />

                <Stack mt={2} spacing={2}>
                    {formValues.clinicPhoneNumbers.map((phone, index) => (
                        <TextField
                            key={index}
                            name={`clinicPhoneNumbers[${index}].phoneNumber`}
                            value={phone.phoneNumber}
                            onChange={(e) => handleChangePhoneNumber(e, index)}
                            label={`Phone Number ${index + 1}`}
                            disabled={!isEditable}
                            variant="outlined"
                            InputProps={{
                                inputProps: {
                                    maxLength: 13,
                                    pattern: '^\\+91\\d{10}$',
                                    title: 'Phone number should start with +91 and have 10 digits',
                                },
                            }}
                            error={phoneNumberErrors[index]}
                            helperText={
                                phoneNumberErrors[index]
                                    ? 'Phone number should start with +91 and have 10 digits'
                                    : ''
                            }
                        />
                    ))}
                </Stack>

                <TextField
                    name="clinicEmail"
                    label="Clinic Email"
                    value={formValues.clinicEmail}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={!isValidEmail(formValues.clinicEmail) || emailError}
                    helperText={emailHelperText}
                />

                <TextField
                    name="clinicWebsite"
                    label="Clinic Website"
                    value={formValues.clinicWebsite}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={websiteError}
                    helperText={websiteHelperText}
                />

                <TextField
                    name="clinicTimings"
                    label="Clinic Timings"
                    value={formValues.clinicTimings}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={timingsError}
                    helperText={timingsHelperText}
                />

                <TextField
                    name="clinicAmenities"
                    label="Clinic Amenities"
                    value={formValues.clinicAmenities}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={amenitiesError}
                    helperText={amenitiesHelperText}
                />
            </CardContent>
        </Card>
    );
}

ClinicDetails.propTypes = {
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

export default ClinicDetails;

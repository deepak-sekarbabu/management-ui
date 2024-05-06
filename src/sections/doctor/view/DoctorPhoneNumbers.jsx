import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { List, ListItem, TextField, Typography, ListItemText, FormHelperText } from '@mui/material';

const DoctorPhoneNumbers = ({ phoneNumbers, onPhoneNumberChange, isEditing }) => {
    // State to keep track of validation errors
    const [errors, setErrors] = useState({});

    // Function to validate the phone number
    const validatePhoneNumber = (phoneNumber, index) => {
        const regex = /^\+91\d{10}$/;
        if (!regex.test(phoneNumber)) {
            setErrors({
                ...errors,
                [index]: 'Phone number must start with +91 and be followed by 10 digits.',
            });
        } else {
            setErrors({
                ...errors,
                [index]: '',
            });
        }
    };

    return (
        <List>
            {phoneNumbers.map((item, index) => (
                <ListItem key={index}>
                    {isEditing ? (
                        <>
                            <TextField
                                label={`Phone Number ${index + 1}`}
                                value={item.phoneNumber}
                                onChange={(e) => {
                                    const trimmedValue = e.target.value.slice(0, 13); // Limit input to 13 characters
                                    onPhoneNumberChange(index, trimmedValue);
                                    validatePhoneNumber(trimmedValue, index);
                                }}
                                error={!!errors[index]}
                                helperText={errors[index]}
                                inputProps={{ maxLength: 13 }} // Limit input to 13 characters
                            />
                            {errors[index] && <FormHelperText error>{errors[index]}</FormHelperText>}
                        </>
                    ) : (
                        <>
                            <Typography variant="body1" color="textSecondary">
                                Phone Number {index + 1} :
                            </Typography>
                            <ListItemText primary={item.phoneNumber} />
                        </>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

DoctorPhoneNumbers.propTypes = {
    phoneNumbers: PropTypes.arrayOf(
        PropTypes.shape({
            phoneNumber: PropTypes.string.isRequired,
        }),
    ).isRequired,
    onPhoneNumberChange: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
};

export default DoctorPhoneNumbers;

import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { List, ListItem, TextField, Typography, ListItemText } from '@mui/material';

const DoctorPhoneNumbers = ({
    phoneNumbers,
    onPhoneNumberChange = () => {},
    isEditing = false,
}) => {
    // State to keep track of validation errors
    const [errors, setErrors] = useState({});

    // Function to validate the phone number
    const validatePhoneNumber = (phoneNumber, index) => {
        console.log('Index:', index, 'Phone Number:', phoneNumber);
        if (!phoneNumber || phoneNumber.trim() === '') {
            setErrors({
                ...errors,
                [index]: 'Phone number cannot be empty.',
            });
        } else {
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
        }
    };
    return (
        <List>
            {phoneNumbers.map((item, index) => (
                <ListItem key={index}>
                    {isEditing ? (
                        <TextField
                            label="Should start +91 and be followed by 10 digits."
                            value={item.phoneNumber}
                            style={{ minWidth: '350px' }}
                            onChange={(e) => {
                                const trimmedValue = e.target.value.slice(0, 13);
                                onPhoneNumberChange(index, trimmedValue);
                                validatePhoneNumber(trimmedValue, index);
                            }}
                            error={!!errors[index]}
                            helperText={errors[index]}
                            inputProps={{ maxLength: 13 }}
                        />
                    ) : (
                        <>
                            <Typography variant="body1" color="textSecondary">
                                Phone Number {index} :
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
        })
    ).isRequired,
    onPhoneNumberChange: PropTypes.func,
    isEditing: PropTypes.bool,
};

export default DoctorPhoneNumbers;

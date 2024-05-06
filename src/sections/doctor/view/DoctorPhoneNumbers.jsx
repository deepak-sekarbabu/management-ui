import React from 'react';
import PropTypes from 'prop-types';

import { List, ListItem, TextField, Typography, ListItemText } from '@mui/material';

const DoctorPhoneNumbers = ({ phoneNumbers, onPhoneNumberChange, isEditing }) => (
    <List>
        {phoneNumbers.map((item, index) => (
            <ListItem key={index}>
                {isEditing ? (
                    <TextField
                        label={`Phone Number ${index + 1}`}
                        value={item.phoneNumber}
                        onChange={(e) => onPhoneNumberChange(index, e.target.value)}
                    />
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
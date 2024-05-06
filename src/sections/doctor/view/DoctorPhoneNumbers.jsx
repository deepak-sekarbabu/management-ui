import React from 'react';
import PropTypes from 'prop-types';

import { List, ListItem, Typography, ListItemText } from '@mui/material';

const DoctorPhoneNumbers = ({ phoneNumbers }) => (
    <List>
        {phoneNumbers.map((item, index) => (
            <ListItem key={index}>
                <Typography variant="body1" color="textSecondary">
                    Phone Number {index + 1} :
                </Typography>
                <ListItemText primary={item.phoneNumber} />
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
};

export default DoctorPhoneNumbers;
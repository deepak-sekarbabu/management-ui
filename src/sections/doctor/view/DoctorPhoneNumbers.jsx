import React from 'react';
import PropTypes from 'prop-types';

import { List, ListItem, ListItemText } from '@mui/material';

const DoctorPhoneNumbers = ({ phoneNumbers }) => (
    <List>
        {phoneNumbers.map((item, index) => (
            <ListItem key={index}>
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
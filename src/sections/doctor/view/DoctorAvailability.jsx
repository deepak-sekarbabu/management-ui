import React from 'react';
import PropTypes from 'prop-types';

import { List, ListItem, ListItemText } from '@mui/material';

const DoctorAvailability = ({ availability }) => (
    <List>
        {availability.map((item, index) => (
            <ListItem key={index}>
                <ListItemText
                    primary={`${item.availableDays} - ${item.shiftTime}`}
                />
            </ListItem>
        ))}
    </List>
);

DoctorAvailability.propTypes = {
    availability: PropTypes.arrayOf(
        PropTypes.shape({
            availableDays: PropTypes.string.isRequired,
            shiftTime: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default DoctorAvailability;
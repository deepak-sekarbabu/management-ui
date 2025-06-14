import PropTypes from 'prop-types';
import React, { useState, useCallback } from 'react'; // Added useCallback

// MUI components for list and text display/input
import { List, ListItem, TextField, Typography, ListItemText, Box } from '@mui/material';

// Component to display and edit a list of phone numbers
const DoctorPhoneNumbers = ({
    phoneNumbers, // Array of phone number objects, e.g., [{ phoneNumber: '+91...' }]
    onPhoneNumberChange = () => {}, // Callback function when a phone number changes
    isEditing = false, // Boolean to toggle edit mode
}) => {
    // State Variables:
    // `errors`: Object to store validation errors for each phone number input field.
    // Key is the index of the phone number, value is the error message string.
    const [errors, setErrors] = useState({});

    // Validation Logic:
    // `validatePhoneNumber`: Function to validate a single phone number.
    // `phoneNumber`: The phone number string to validate.
    // `index`: The index of the phone number in the list, used for storing errors.
    const validatePhoneNumber = useCallback(
        (phoneNumber, index) => {
            let errorMsg = ''; // Initialize error message as empty

            if (!phoneNumber || phoneNumber.trim() === '') {
                errorMsg = 'Phone number cannot be empty.';
                // Regex for Indian phone numbers: starts with +91, followed by 10 digits.
                // For more general international numbers, a more complex regex or library would be needed.
            } else if (!/^\+91\d{10}$/.test(phoneNumber)) {
                errorMsg = 'Must be a 10-digit number prefixed with +91 (e.g., +919876543210).';
            }

            // Update errors state: set the error message for the specific index,
            // or clear it if `errorMsg` is empty.
            setErrors((prevErrors) => ({
                ...prevErrors,
                [index]: errorMsg,
            }));
        },
        [] // No dependencies, as setErrors updater form handles prevErrors.
    );

    // Rendering Logic:
    // Renders a MUI `List` component.
    // Each phone number is a `ListItem`.
    // In edit mode (`isEditing` is true), `TextField` is rendered for input.
    // In view mode, `Typography` and `ListItemText` are used to display the number.
    return (
        // List container for phone numbers.
        // `dense` prop can be used for a more compact list if needed.
        <List dense={isEditing}>
            {phoneNumbers.map((item, index) => (
                // Each phone number entry is a ListItem.
                // `key={index}` is used for React's list rendering, assuming phone numbers don't have unique IDs here.
                // If they had IDs, `key={item.id}` would be better.
                <ListItem
                    key={index}
                    // Disable padding in edit mode for tighter layout with TextField taking full width
                    disablePadding={isEditing}
                    sx={{
                        // Add some bottom margin in edit mode for separation if multiple numbers
                        mb: isEditing ? 1 : 0,
                        // Responsive padding for view mode
                        pl: isEditing ? 0 : { xs: 0, sm: 1 },
                        pr: isEditing ? 0 : { xs: 0, sm: 1 },
                    }}
                >
                    {isEditing ? (
                        // EDIT MODE: Render TextField for input
                        <TextField
                            label={`Phone Number ${index + 1}`} // Standard label
                            // Placeholder shows format example.
                            placeholder="E.g., +919876543210"
                            value={item.phoneNumber || ''} // Controlled component; ensure value is not undefined
                            // Removed fixed minWidth, using fullWidth for responsiveness.
                            fullWidth
                            onChange={(e) => {
                                // Limit input length to 13 characters (+91 and 10 digits).
                                const trimmedValue = e.target.value.slice(0, 13);
                                onPhoneNumberChange(index, trimmedValue); // Notify parent of change
                                validatePhoneNumber(trimmedValue, index); // Validate on change
                            }}
                            // Display error state and helper text if there's an error for this index.
                            error={!!errors[index]}
                            helperText={errors[index] || ' '} {/* Show space to maintain layout even if no error */}
                            inputProps={{
                                maxLength: 13, // HTML5 attribute to limit input length
                                type: 'tel', // Use type="tel" for semantic phone number input
                                'aria-label': `Phone number ${index + 1}`, // Accessibility: ARIA label
                            }}
                            variant="outlined" // Standard variant
                            size="small" // Smaller size for dense lists
                        />
                    ) : (
                        // VIEW MODE: Display phone number using Typography and ListItemText
                        // Using Box for flex layout to ensure label and number are on the same line and wrap well.
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                width: '100%',
                                alignItems: 'baseline', // Align text baseline
                                flexWrap: 'wrap', // Allow wrapping on small screens
                            }}
                        >
                            <Typography
                                variant="body1"
                                color="text.secondary" // Use theme's secondary text color
                                sx={{ mr: 1, fontWeight: 'medium' }} // Margin right for spacing
                            >
                                Phone {index + 1}:
                            </Typography>
                            {/* ListItemText is used here for consistency, but Typography alone would also work. */}
                            {/* `primary` prop displays the phone number. */}
                            <ListItemText
                                primary={item.phoneNumber || 'N/A'} // Show N/A if number is missing
                                primaryTypographyProps={{
                                    variant: 'body1',
                                    color: 'text.primary', // Use theme's primary text color
                                    sx: { wordBreak: 'break-all' }, // Allow long numbers to break and wrap
                                }}
                            />
                        </Box>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

// PropTypes for type checking. Ensures that the component receives props of the correct type.
DoctorPhoneNumbers.propTypes = {
    // `phoneNumbers`: An array of objects, where each object has a `phoneNumber` string.
    phoneNumbers: PropTypes.arrayOf(
        PropTypes.shape({
            phoneNumber: PropTypes.string, // Not strictly isRequired if a new empty entry can exist
        })
    ).isRequired, // The array itself is required.
    // `onPhoneNumberChange`: A function called when a phone number input changes.
    // Passes the index and the new value.
    onPhoneNumberChange: PropTypes.func,
    // `isEditing`: Boolean flag to switch between view and edit modes.
    isEditing: PropTypes.bool,
};

// Default props for the component.
DoctorPhoneNumbers.defaultProps = {
    onPhoneNumberChange: () => {}, // No-op function if not provided
    isEditing: false, // Default to view mode
    phoneNumbers: [], // Default to an empty array if not provided
};

export default DoctorPhoneNumbers;

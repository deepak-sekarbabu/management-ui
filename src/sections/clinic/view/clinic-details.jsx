import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Card, Stack, TextField, CardContent } from '@mui/material';

// Styled components with improved animations and transitions
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const StyledCard = styled(Card)(({ theme }) => ({
    animation: `${slideIn} 0.5s ease-out`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[8],
    },
    [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(1),
    },
    [theme.breakpoints.up('sm')]: {
        margin: theme.spacing(2),
    },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    transition: 'all 0.3s ease-in-out',
    '& .MuiOutlinedInput-root': {
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
        },
        // Improved focus styles for accessibility
        '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
            },
        },
    },
    '& .MuiInputLabel-root': {
        transition: 'all 0.3s ease-in-out',
    },
    '&:focus-within': {
        transform: 'translateY(-2px)',
    },
}));

const FormStack = styled(Stack)(({ theme }) => ({
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(1.5),
    },
}));

/**
 * ClinicDetails Component
 * Displays and manages editable clinic information form
 * Features:
 * - Form validation with error messages
 * - Responsive design
 * - Keyboard navigation support
 * - ARIA labels for accessibility
 * - Input field constraints
 */
function ClinicDetails({ clinic, isEditable, onFormValuesChange }) {
    // State management
    const [formValues, setFormValues] = useState(clinic);
    const [phoneNumberErrors, setPhoneNumberErrors] = useState([]);
    const [emailError, setEmailError] = useState(false);
    const [websiteError, setWebsiteError] = useState(false);
    const [timingsError, setTimingsError] = useState(false);
    const [amenitiesError, setAmenitiesError] = useState(false);

    // Validation functions
    const validatePhoneNumber = useCallback((phoneNumber) => {
        const phoneRegex = /^\+91\d{10}$/;
        return phoneRegex.test(phoneNumber);
    }, []);

    const isValidEmail = useCallback((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, []);

    const isValidWebsite = useCallback((website) => {
        if (!website) return true;
        const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return websiteRegex.test(website);
    }, []);

    // Update form values when clinic prop changes
    useEffect(() => {
        setFormValues(clinic);
    }, [clinic]);

    // Event handlers
    const handleChangePhoneNumber = useCallback(
        (e, index) => {
            const { value } = e.target;
            const updatedPhoneNumbers = [...formValues.clinicPhoneNumbers];
            const isValid = validatePhoneNumber(value);
            updatedPhoneNumbers[index] = { ...updatedPhoneNumbers[index], phoneNumber: value };
            setFormValues((prev) => ({ ...prev, clinicPhoneNumbers: updatedPhoneNumbers }));
            onFormValuesChange({ ...formValues, clinicPhoneNumbers: updatedPhoneNumbers });
            setPhoneNumberErrors((prevErrors) => {
                const newErrors = [...prevErrors];
                newErrors[index] = !isValid;
                return newErrors;
            });
        },
        [formValues, onFormValuesChange, validatePhoneNumber]
    );

    const handleChange = useCallback(
        (e) => {
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
                    setEmailError(!isValidEmail(updatedValue));
                    break;
                case 'clinicTimings':
                    updatedValue = value.slice(0, 150);
                    setTimingsError(updatedValue.length > 149);
                    break;
                case 'clinicWebsite':
                    updatedValue = value.slice(0, 150);
                    setWebsiteError(!isValidWebsite(updatedValue));
                    break;
                case 'clinicAmenities':
                    updatedValue = value.slice(0, 150);
                    setAmenitiesError(updatedValue.length > 149);
                    break;
                default:
                    break;
            }

            setFormValues((prev) => ({ ...prev, [name]: updatedValue }));
            onFormValuesChange({ ...formValues, [name]: updatedValue });
        },
        [formValues, onFormValuesChange, isValidEmail, isValidWebsite]
    );

    // Helper function to get email helper text
    const getEmailHelperText = useCallback(() => {
        if (!isValidEmail(formValues.clinicEmail)) {
            return 'Invalid email address';
        }
        if (emailError) {
            return 'Clinic Email should not exceed 120 characters';
        }
        return '';
    }, [formValues.clinicEmail, emailError, isValidEmail]);

    // Memoized helper text
    const helperTexts = useMemo(
        () => ({
            email: getEmailHelperText(),
            website: websiteError ? 'Invalid website URL format' : '',
            timings: timingsError ? 'Clinic Timings should not exceed 149 characters' : '',
            amenities: amenitiesError ? 'Clinic Amenities should not exceed 149 characters' : '',
        }),
        [getEmailHelperText, websiteError, timingsError, amenitiesError]
    );

    // Memoized form fields
    const formFields = useMemo(
        () => (
            <FormStack>
                <StyledTextField
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
                    inputProps={{
                        'aria-label': 'Clinic name',
                        maxLength: 150,
                    }}
                    required
                />

                <StyledTextField
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
                    inputProps={{
                        'aria-label': 'Clinic address',
                        maxLength: 200,
                    }}
                    required
                />

                <StyledTextField
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
                    inputProps={{
                        'aria-label': 'Clinic pin code',
                        maxLength: 10,
                        pattern: '\\d*',
                    }}
                    required
                />

                <FormStack mt={2}>
                    {formValues.clinicPhoneNumbers.map((phone, index) => (
                        <StyledTextField
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
                                    'aria-label': `Phone number ${index + 1}`,
                                },
                            }}
                            error={phoneNumberErrors[index]}
                            helperText={
                                phoneNumberErrors[index]
                                    ? 'Phone number should start with +91 and have 10 digits'
                                    : ''
                            }
                            required
                        />
                    ))}
                </FormStack>

                <StyledTextField
                    name="clinicEmail"
                    label="Clinic Email"
                    value={formValues.clinicEmail}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={!isValidEmail(formValues.clinicEmail) || emailError}
                    helperText={helperTexts.email}
                    inputProps={{
                        'aria-label': 'Clinic email',
                        maxLength: 120,
                        type: 'email',
                    }}
                    required
                />

                <StyledTextField
                    name="clinicWebsite"
                    label="Clinic Website"
                    value={formValues.clinicWebsite}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={websiteError}
                    helperText={helperTexts.website}
                    inputProps={{
                        'aria-label': 'Clinic website',
                        maxLength: 150,
                        type: 'url',
                    }}
                />

                <StyledTextField
                    name="clinicTimings"
                    label="Clinic Timings"
                    value={formValues.clinicTimings}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={timingsError}
                    helperText={helperTexts.timings}
                    inputProps={{
                        'aria-label': 'Clinic timings',
                        maxLength: 150,
                    }}
                    required
                />

                <StyledTextField
                    name="clinicAmenities"
                    label="Clinic Amenities"
                    value={formValues.clinicAmenities}
                    onChange={handleChange}
                    disabled={!isEditable}
                    fullWidth
                    margin="normal"
                    error={amenitiesError}
                    helperText={helperTexts.amenities}
                    inputProps={{
                        'aria-label': 'Clinic amenities',
                        maxLength: 150,
                    }}
                />
            </FormStack>
        ),
        [
            formValues,
            isEditable,
            handleChange,
            handleChangePhoneNumber,
            phoneNumberErrors,
            helperTexts,
            isValidEmail,
            emailError,
            websiteError,
            timingsError,
            amenitiesError,
        ]
    );

    return (
        <StyledCard>
            <StyledCardContent>
                <form noValidate autoComplete="off" aria-label="Clinic details form">
                    {formFields}
                </form>
            </StyledCardContent>
        </StyledCard>
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

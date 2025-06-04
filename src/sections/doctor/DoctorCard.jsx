import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Card,
    Chip,
    Radio,
    Avatar,
    Button,
    TextField,
    RadioGroup,
    Typography,
    CardContent,
    Autocomplete,
    FormControlLabel,
} from '@mui/material';

import DoctorAvailability from './DoctorAvailability';
import DoctorPhoneNumbers from './DoctorPhoneNumbers';

const DoctorCard = React.memo(({ doctor, isNewDoctor = false, onSave, onRemove, clinicId }) => {
    const [isEditing, setIsEditing] = useState(isNewDoctor);
    const [formState, setFormState] = useState({
        ...doctor,
        languagesSpoken: Array.isArray(doctor.languagesSpoken)
            ? doctor.languagesSpoken.map(String)
            : [],
        qualifications: Array.isArray(doctor.qualifications)
            ? doctor.qualifications.map(String)
            : [],
        validationErrors: {},
    });

    // Keep formState updated when doctor prop changes
    useEffect(() => {
        if (!isEditing) {
            setFormState((prevState) => ({
                ...doctor,
                languagesSpoken: Array.isArray(doctor.languagesSpoken)
                    ? doctor.languagesSpoken.map(String)
                    : [],
                qualifications: Array.isArray(doctor.qualifications)
                    ? doctor.qualifications.map(String)
                    : [],
                validationErrors: prevState.validationErrors,
            }));
        }
    }, [doctor, isEditing]);

    const [isDetailsExpanded, setIsDetailsExpanded] = useState(isNewDoctor);
    const [avatar, setAvatar] = useState(
        `/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`
    );

    useEffect(() => {
        setAvatar(`/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`);
    }, [doctor.id]);

    const validateDoctorData = useCallback((doctorData) => {
        const errors = {};

        // Check if doctorName is empty
        if (!doctorData.doctorName || doctorData.doctorName.trim().length === 0) {
            errors.doctorName = 'Doctor name cannot be empty';
        }

        if (!/^[a-zA-Z.\s]+$/.test(doctorData.doctorName) || doctorData.doctorName.length > 120) {
            errors.doctorName =
                'Doctor name must be alphabets, spaces, and dots, and not more than 120 characters';
        }

        // Check if doctorId is empty
        if (!doctorData.doctorId || doctorData.doctorId.trim().length === 0) {
            errors.doctorId = 'Doctor ID cannot be empty';
        }

        // Existing validation checks
        if (doctorData.doctorId.length > 50) {
            errors.doctorId = 'Doctor ID cannot be more than 50 characters';
        }

        // Check if doctorSpeciality is empty
        if (!doctorData.doctorSpeciality || doctorData.doctorSpeciality.trim().length === 0) {
            errors.doctorSpeciality = 'Doctor specialty cannot be empty';
        }

        if (doctorData.doctorSpeciality.length > 120) {
            errors.doctorSpeciality = 'Doctor specialty must not be more than 120 characters';
        }

        // Check if doctorExperience is empty or not a number
        if (!doctorData.doctorExperience || Number.isNaN(doctorData.doctorExperience)) {
            errors.doctorExperience = 'Doctor experience must be a number';
        }

        if (doctorData.doctorExperience > 70) {
            errors.doctorExperience = 'Doctor experience cannot be more than 70';
        }

        // Check if doctorConsultationFee is empty or not a number
        if (!doctorData.doctorConsultationFee || Number.isNaN(doctorData.doctorConsultationFee)) {
            errors.doctorConsultationFee = 'Consultation fee must be a number';
        }

        // Check if doctorConsultationFeeOther is empty or not a number
        if (
            !doctorData.doctorConsultationFeeOther ||
            Number.isNaN(doctorData.doctorConsultationFeeOther)
        ) {
            errors.doctorConsultationFeeOther = 'Consultation fee Queue must be a number';
        }

        return errors;
    }, []);

    const handleExpandDetails = useCallback(() => {
        console.log(`Expanding details for doctor: ${doctor.doctorName}`);
        setIsDetailsExpanded(!isDetailsExpanded);
    }, [doctor.doctorName, isDetailsExpanded]);

    const handleEdit = useCallback(() => {
        console.log(`Editing doctor: ${doctor.doctorName}`);
        // When entering edit mode, ensure languagesSpoken and qualifications are initialized as arrays
        setFormState((prevState) => ({
            ...prevState,
            languagesSpoken: Array.isArray(doctor.languagesSpoken)
                ? doctor.languagesSpoken.map(String)
                : [],
            qualifications: Array.isArray(doctor.qualifications)
                ? doctor.qualifications.map(String)
                : [],
        }));
        setIsEditing(true);
    }, [doctor.doctorName, doctor.languagesSpoken, doctor.qualifications]);

    const handleRemove = useCallback(() => {
        console.log(
            'Removing doctor with clinicId and doctorId:',
            doctor.clinicId,
            doctor.doctorId
        );
        console.log(`Removing doctor: ${doctor.doctorName}`);
        if (onRemove) {
            // Pass clinicId and doctorId for correct API usage
            onRemove(doctor.clinicId, doctor.doctorId);
        }
    }, [onRemove, doctor.clinicId, doctor.doctorId, doctor.doctorName]);
    const handleSave = useCallback(() => {
        // Validate the edited doctor data
        const errors = validateDoctorData(formState);
        if (Object.keys(errors).length > 0) {
            setFormState((prevState) => ({ ...prevState, validationErrors: errors }));
            return;
        }

        // Always send languagesSpoken and qualifications as arrays (even if empty)
        const dataToSave = {
            ...formState,
            languagesSpoken: Array.isArray(formState.languagesSpoken)
                ? formState.languagesSpoken.map(String)
                : [],
            qualifications: Array.isArray(formState.qualifications)
                ? formState.qualifications.map(String)
                : [],
            // Remove validationErrors from the data being saved
            validationErrors: undefined,
        };

        console.log('Saving doctor with fixed arrays:', dataToSave);
        setIsEditing(false);

        // Call the onSave function passed from the parent component
        if (onSave) {
            // Pass clinicId and doctorId for correct API usage
            onSave(dataToSave, clinicId);
        }
    }, [formState, onSave, validateDoctorData, clinicId]);

    const handleCancel = useCallback(() => {
        console.log(`Cancelling edit for doctor: ${doctor.doctorName}`);
        if (isNewDoctor) {
            console.log(`Removing new doctor: ${doctor.doctorName}`);
            // Call the onRemove function passed from the parent component to remove the new doctor
            if (onRemove) {
                onRemove(doctor.id); // Ensure this is the correct parameter expected by onRemove
            }
            // Reset form state to initial
            setFormState({ validationErrors: {} });
        } else {
            setFormState({ ...doctor, validationErrors: {} });
            setIsEditing(false);
            setIsDetailsExpanded(false);
        }
    }, [isNewDoctor, onRemove, doctor]);

    const handleInputChange = useCallback(
        (field, value) => {
            let newValue = value;
            // Always store as array of strings for these fields
            if (field === 'languagesSpoken' || field === 'qualifications') {
                newValue = Array.isArray(value) ? value.map(String) : [];
            }
            const errors = validateDoctorData({ ...formState, [field]: newValue });
            console.log(`handleInputChange: Before update ${field}:`, formState[field]);
            const newState = {
                ...formState,
                [field]: newValue,
                validationErrors: errors,
            };
            console.log(`handleInputChange: After update ${field}:`, newState[field]);
            setFormState(newState);
            console.log(`Updated ${field} for doctor: ${doctor.doctorName}`);
            console.log(`Field: ${field}, Value:`, value);
        },
        [formState, doctor.doctorName, validateDoctorData]
    );

    const handlePhoneNumberChange = useCallback(
        (index, value) => {
            setFormState((prevState) => ({
                ...prevState,
                phoneNumbers: prevState.phoneNumbers.map((item, i) =>
                    i === index ? { ...item, phoneNumber: value } : item
                ),
            }));
            console.log(`Updated phone number for doctor: ${doctor.doctorName}`);
        },
        [doctor.doctorName]
    ); // Include doctor.doctorName in the dependency array

    const handleAvailabilityChange = useCallback(
        (newAvailability) => {
            console.log('Availability updated:', newAvailability);
            setFormState((prevState) => ({ ...prevState, doctorAvailability: newAvailability }));
            console.log(`Updated availability for doctor: ${doctor.doctorName}`);
        },
        [doctor.doctorName]
    );

    // Add this new function to handle adding values on blur
    const handleAutocompleteBlur = useCallback(
        (field, inputValue) => {
            if (inputValue && inputValue.trim() !== '') {
                // Get current values
                const currentValues = formState[field] || [];
                // Only add if it's not already in the array
                if (!currentValues.includes(inputValue.trim())) {
                    handleInputChange(field, [...currentValues, inputValue.trim()]);
                }
            }
        },
        [formState, handleInputChange]
    );

    // Use a ref to track the current input value for each Autocomplete
    const languagesInputRef = React.useRef('');
    const qualificationsInputRef = React.useRef('');

    // Ensure consultationTime is always a number in doctorAvailability
    const normalizedDoctorAvailability = (doctor.doctorAvailability || []).map((item) => ({
        ...item,
        consultationTime:
            typeof item.consultationTime === 'string'
                ? Number(item.consultationTime)
                : item.consultationTime,
    }));

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Card
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    onClick={handleExpandDetails}
                >
                    <Avatar alt={doctor.doctorName} src={avatar} />
                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{ ml: 2 }}
                        onClick={handleExpandDetails}
                    >
                        {doctor.doctorName}
                    </Typography>
                </Card>
                {isDetailsExpanded && (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {isEditing ? (
                            <>
                                <TextField
                                    label="Doctor Name"
                                    value={formState.doctorName}
                                    onChange={(e) =>
                                        handleInputChange('doctorName', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorName}
                                    helperText={formState.validationErrors.doctorName}
                                    style={{ marginTop: '20px' }}
                                />
                                <TextField
                                    label="Doctor ID"
                                    value={formState.doctorId}
                                    onChange={(e) => handleInputChange('doctorId', e.target.value)}
                                    error={!!formState.validationErrors.doctorId}
                                    helperText={formState.validationErrors.doctorId}
                                />
                                <RadioGroup
                                    row
                                    value={formState.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                >
                                    <FormControlLabel
                                        value="Male"
                                        control={<Radio />}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        value="Female"
                                        control={<Radio />}
                                        label="Female"
                                    />
                                </RadioGroup>
                                <TextField
                                    label="Email"
                                    value={formState.doctorEmail}
                                    onChange={(e) =>
                                        handleInputChange('doctorEmail', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorEmail}
                                    helperText={formState.validationErrors.doctorEmail}
                                />
                                <TextField
                                    label="Doctor Specialty"
                                    value={formState.doctorSpeciality}
                                    onChange={(e) =>
                                        handleInputChange('doctorSpeciality', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorSpeciality}
                                    helperText={formState.validationErrors.doctorSpeciality}
                                />
                                <TextField
                                    label="Doctor Experience in years"
                                    value={formState.doctorExperience}
                                    onChange={(e) =>
                                        handleInputChange('doctorExperience', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorExperience}
                                    helperText={formState.validationErrors.doctorExperience}
                                    inputProps={{
                                        type: 'number', // This ensures that only numbers can be entered
                                        min: 1, // Optionally, you can set a minimum value
                                        max: 70, // Restricts the maximum value to 70
                                        maxLength: 2, // Restricts the maximum number of digits to 2
                                    }}
                                />
                                <TextField
                                    label="Consultation Fee Appointment in Rupees"
                                    value={formState.doctorConsultationFee}
                                    onChange={(e) =>
                                        handleInputChange('doctorConsultationFee', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorConsultationFee}
                                    helperText={formState.validationErrors.doctorConsultationFee}
                                    inputProps={{
                                        type: 'number', // This ensures that only numbers can be entered
                                    }}
                                />
                                <TextField
                                    label="Consultation Fee Queue in Rupees"
                                    value={formState.doctorConsultationFeeOther}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'doctorConsultationFeeOther',
                                            e.target.value
                                        )
                                    }
                                    error={!!formState.validationErrors.doctorConsultationFeeOther}
                                    helperText={
                                        formState.validationErrors.doctorConsultationFeeOther
                                    }
                                    inputProps={{
                                        type: 'number', // This ensures that only numbers can be entered
                                    }}
                                />{' '}
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={formState.languagesSpoken || []}
                                    onChange={(e, value) =>
                                        handleInputChange(
                                            'languagesSpoken',
                                            Array.isArray(value) ? value.map(String) : []
                                        )
                                    }
                                    onInputChange={(event, newInputValue) => {
                                        languagesInputRef.current = newInputValue;
                                    }}
                                    onBlur={() => {
                                        handleAutocompleteBlur(
                                            'languagesSpoken',
                                            languagesInputRef.current
                                        );
                                        languagesInputRef.current = '';
                                    }}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const tagProps = getTagProps({ index });
                                            // Extract key from tagProps to avoid spreading key prop
                                            const { key, ...chipProps } = tagProps;
                                            return (
                                                <Chip
                                                    key={key}
                                                    variant="outlined"
                                                    label={option}
                                                    {...chipProps}
                                                />
                                            );
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Languages Spoken"
                                            placeholder="Add language"
                                        />
                                    )}
                                    sx={{ mt: 2 }}
                                />{' '}
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={formState.qualifications || []}
                                    onChange={(e, value) =>
                                        handleInputChange(
                                            'qualifications',
                                            Array.isArray(value) ? value.map(String) : []
                                        )
                                    }
                                    onInputChange={(event, newInputValue) => {
                                        qualificationsInputRef.current = newInputValue;
                                    }}
                                    onBlur={() => {
                                        handleAutocompleteBlur(
                                            'qualifications',
                                            qualificationsInputRef.current
                                        );
                                        qualificationsInputRef.current = '';
                                    }}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => {
                                            const tagProps = getTagProps({ index });
                                            // Extract key from tagProps to avoid spreading key prop
                                            const { key, ...chipProps } = tagProps;
                                            return (
                                                <Chip
                                                    key={key}
                                                    variant="outlined"
                                                    label={option}
                                                    {...chipProps}
                                                />
                                            );
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Qualifications"
                                            placeholder="Add qualification"
                                        />
                                    )}
                                    sx={{ mt: 2 }}
                                />
                                <DoctorPhoneNumbers
                                    phoneNumbers={formState.phoneNumbers}
                                    onPhoneNumberChange={handlePhoneNumberChange}
                                    isEditing={isEditing}
                                />
                                <DoctorAvailability
                                    availability={formState.doctorAvailability.map((item) => ({
                                        ...item,
                                        consultationTime:
                                            typeof item.consultationTime === 'string'
                                                ? Number(item.consultationTime)
                                                : item.consultationTime,
                                    }))}
                                    onAvailabilityChange={handleAvailabilityChange}
                                    isEditing={isEditing}
                                />
                                <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button variant="outlined" onClick={handleSave}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Typography
                                    style={{ marginTop: '20px' }}
                                    variant="body1"
                                    color="textSecondary"
                                >
                                    {doctor.doctorId}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Gender: {doctor.gender}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Email: {doctor.doctorEmail}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {doctor.doctorSpeciality}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Experience: {doctor.doctorExperience} years
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Consultation Fee Appointment: ₹{doctor.doctorConsultationFee}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Consultation Fee Queue: ₹{doctor.doctorConsultationFeeOther}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Languages Spoken:{' '}
                                    {Array.isArray(doctor.languagesSpoken) &&
                                    doctor.languagesSpoken.length > 0
                                        ? doctor.languagesSpoken.join(', ')
                                        : ''}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Qualifications:{' '}
                                    {Array.isArray(doctor.qualifications) &&
                                    doctor.qualifications.length > 0
                                        ? doctor.qualifications.join(', ')
                                        : ''}
                                </Typography>
                                <DoctorPhoneNumbers
                                    phoneNumbers={doctor.phoneNumbers}
                                    onPhoneNumberChange={() => {}} // Add empty handler for view mode
                                    isEditing={false} // Explicitly set to false for view mode
                                />
                                <DoctorAvailability
                                    availability={normalizedDoctorAvailability}
                                    onAvailabilityChange={() => {}} // Add empty handler for view mode
                                    isEditing={false} // Explicitly set to false for view mode
                                />

                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    gap={2}
                                >
                                    <Button variant="outlined" onClick={handleEdit}>
                                        Edit
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={handleRemove}>
                                        Remove
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
});

DoctorCard.propTypes = {
    doctor: PropTypes.shape({
        id: PropTypes.any.isRequired,
        doctorName: PropTypes.string.isRequired,
        doctorId: PropTypes.string.isRequired,
        clinicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        doctorSpeciality: PropTypes.string.isRequired,
        doctorExperience: PropTypes.number.isRequired,
        doctorConsultationFee: PropTypes.number.isRequired,
        doctorConsultationFeeOther: PropTypes.number.isRequired,
        gender: PropTypes.string.isRequired,
        doctorEmail: PropTypes.string.isRequired,
        phoneNumbers: PropTypes.arrayOf(
            PropTypes.shape({
                phoneNumber: PropTypes.string.isRequired,
            })
        ).isRequired,
        doctorAvailability: PropTypes.arrayOf(
            PropTypes.shape({
                availableDays: PropTypes.string.isRequired,
                shiftTime: PropTypes.string.isRequired,
                shiftStartTime: PropTypes.string.isRequired,
                shiftEndTime: PropTypes.string.isRequired,
                consultationTime: PropTypes.number.isRequired,
                configType: PropTypes.string.isRequired,
            })
        ).isRequired,
        languagesSpoken: PropTypes.arrayOf(PropTypes.string),
        qualifications: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isNewDoctor: PropTypes.bool,
    onSave: PropTypes.func,
    onRemove: PropTypes.func,
    clinicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default DoctorCard;

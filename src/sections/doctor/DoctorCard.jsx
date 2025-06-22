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

// React.memo for performance optimization, prevents re-render if props haven't changed.
const DoctorCard = React.memo(({ doctor, isNewDoctor = false, onSave, onRemove, clinicId }) => {
    // State Variables:
    // `isEditing`: Boolean, tracks if the card is in edit mode or view mode. Initialized based on `isNewDoctor`.
    const [isEditing, setIsEditing] = useState(isNewDoctor);
    // `formState`: Object, holds the current state of the form fields, including validation errors.
    // It's initialized with the `doctor` prop data, ensuring arrays are correctly formatted.
    const [formState, setFormState] = useState({
        ...doctor, // Spread initial doctor data
        languagesSpoken: Array.isArray(doctor.languagesSpoken) // Ensure languagesSpoken is an array of strings
            ? doctor.languagesSpoken.map(String)
            : [],
        qualifications: Array.isArray(doctor.qualifications) // Ensure qualifications is an array of strings
            ? doctor.qualifications.map(String)
            : [],
        validationErrors: {}, // Object to store validation errors for form fields
    });

    // `isDetailsExpanded`: Boolean, controls the visibility of the detailed section of the card.
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(isNewDoctor);
    // `avatar`: String, stores the URL for the doctor's avatar image. Randomized on initial load.
    const [avatar, setAvatar] = useState(
        `/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`
    );

    // Track validation state from DoctorAvailability
    const [hasAvailabilityErrors, setHasAvailabilityErrors] = useState(false);

    // useEffect Hooks:

    // Synchronizes `formState` with the `doctor` prop when the `doctor` prop changes and the card is not in editing mode.
    // This ensures that if the parent component updates the doctor's data, the view mode reflects these changes.
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
                validationErrors: prevState.validationErrors, // Preserve existing validation errors if any (though typically cleared when not editing)
            }));
        }
    }, [doctor, isEditing]); // Dependencies: `doctor` prop and `isEditing` state.

    // Updates the avatar when the `doctor.id` changes. This ensures a new doctor gets a new random avatar.
    useEffect(() => {
        setAvatar(`/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`);
    }, [doctor.id]); // Dependency: `doctor.id`.

    // Validation Logic:
    // `validateDoctorData`: Function, performs validation checks on the doctor data.
    // Returns an errors object; if the object is empty, the data is considered valid.
    const validateDoctorData = useCallback((doctorData) => {
        const errors = {};

        // Validate Doctor Name: required, alphabets/spaces/dots, max 120 chars.
        if (!doctorData.doctorName || doctorData.doctorName.trim().length === 0) {
            errors.doctorName = 'Doctor name cannot be empty.';
        } else if (
            !/^[a-zA-Z.\s]+$/.test(doctorData.doctorName) ||
            doctorData.doctorName.length > 120
        ) {
            errors.doctorName =
                'Doctor name must contain only alphabets, spaces, or dots, and be no more than 120 characters.';
        }

        // Validate Doctor ID: required, max 50 chars.
        if (!doctorData.doctorId || doctorData.doctorId.trim().length === 0) {
            errors.doctorId = 'Doctor ID cannot be empty.';
        } else if (doctorData.doctorId.length > 50) {
            errors.doctorId = 'Doctor ID cannot be more than 50 characters.';
        }

        // Validate Doctor Specialty: required, max 120 chars.
        if (!doctorData.doctorSpeciality || doctorData.doctorSpeciality.trim().length === 0) {
            errors.doctorSpeciality = 'Doctor specialty cannot be empty.';
        } else if (doctorData.doctorSpeciality.length > 120) {
            errors.doctorSpeciality = 'Doctor specialty must not be more than 120 characters.';
        }

        // Validate Doctor Experience: required, number, max 70 years.
        // The maxLength: 2 on input is a UI hint but server/data model should be the source of truth.
        if (
            doctorData.doctorExperience === null || // Check for null or undefined
            doctorData.doctorExperience === undefined ||
            String(doctorData.doctorExperience).trim() === '' || // Check for empty string
            Number.isNaN(Number(doctorData.doctorExperience)) // Check if it's not a number
        ) {
            errors.doctorExperience = 'Doctor experience must be a number.';
        } else if (Number(doctorData.doctorExperience) > 70) {
            errors.doctorExperience = 'Doctor experience cannot be more than 70 years.';
        } else if (Number(doctorData.doctorExperience) < 0) {
            errors.doctorExperience = 'Doctor experience cannot be negative.';
        }

        // Validate Consultation Fee (Appointment): required, number.
        if (
            doctorData.doctorConsultationFee === null ||
            doctorData.doctorConsultationFee === undefined ||
            String(doctorData.doctorConsultationFee).trim() === '' ||
            Number.isNaN(Number(doctorData.doctorConsultationFee))
        ) {
            errors.doctorConsultationFee = 'Consultation fee (appointment) must be a number.';
        } else if (Number(doctorData.doctorConsultationFee) < 0) {
            errors.doctorConsultationFee = 'Consultation fee (appointment) cannot be negative.';
        }

        // Validate Consultation Fee (Queue/Other): required, number.
        if (
            doctorData.doctorConsultationFeeOther === null ||
            doctorData.doctorConsultationFeeOther === undefined ||
            String(doctorData.doctorConsultationFeeOther).trim() === '' ||
            Number.isNaN(Number(doctorData.doctorConsultationFeeOther))
        ) {
            errors.doctorConsultationFeeOther = 'Consultation fee (queue) must be a number.';
        } else if (Number(doctorData.doctorConsultationFeeOther) < 0) {
            errors.doctorConsultationFeeOther = 'Consultation fee (queue) cannot be negative.';
        }
        // Note: Email validation can be more complex (e.g., regex), but MUI TextField type="email" provides some browser-level validation.
        // For this example, we'll skip adding a complex regex here but it could be added if needed.

        return errors;
    }, []); // Empty dependency array as it has no external dependencies.

    // Event Handlers:

    // `handleExpandDetails`: Toggles the `isDetailsExpanded` state to show/hide doctor details.
    const handleExpandDetails = useCallback(() => {
        setIsDetailsExpanded((prevExpanded) => !prevExpanded);
    }, []); // Dependency: `isDetailsExpanded`.

    // `handleEdit`: Switches the card to editing mode.
    // It also ensures that `languagesSpoken` and `qualifications` in `formState` are initialized as arrays
    // from the `doctor` prop, as Autocomplete expects array values.
    const handleEdit = useCallback(() => {
        setFormState((prevState) => ({
            ...doctor, // Reset form with original doctor data to discard previous unsaved changes
            languagesSpoken: Array.isArray(doctor.languagesSpoken)
                ? doctor.languagesSpoken.map(String)
                : [],
            qualifications: Array.isArray(doctor.qualifications)
                ? doctor.qualifications.map(String)
                : [],
            validationErrors: {}, // Clear any previous validation errors
        }));
        setIsEditing(true);
        setIsDetailsExpanded(true); // Ensure details are expanded when editing
    }, [doctor]); // Dependencies: `doctor` prop.

    // `handleRemove`: Calls the `onRemove` prop function to delete the doctor.
    // It passes `doctor.clinicId` and `doctor.doctorId` for backend API calls.
    // For a new, unsaved doctor, it might pass `doctor.id` (the temporary client-side ID).
    const handleRemove = useCallback(() => {
        if (onRemove) {
            if (isNewDoctor && doctor.id) {
                onRemove(doctor.id); // Use temporary ID for unsaved new doctor
            } else {
                onRemove(doctor.clinicId, doctor.doctorId); // Use persistent IDs for saved doctor
            }
        }
    }, [onRemove, doctor, isNewDoctor]); // Dependencies: `onRemove` prop, `doctor` object, `isNewDoctor`.

    // `handleSave`: Validates the form data and calls the `onSave` prop function.
    // It constructs `dataToSave` ensuring arrays are correctly formatted and `validationErrors` is not included.
    const handleSave = useCallback(() => {
        if (hasAvailabilityErrors) {
            // Optionally show a message or notification here
            return; // Block save if there are errors in availability
        }
        const currentFormState = { ...formState }; // Create a copy to avoid direct mutation issues in validation
        const errors = validateDoctorData(currentFormState);
        if (Object.keys(errors).length > 0) {
            setFormState((prevState) => ({ ...prevState, validationErrors: errors }));
            return; // Prevent save if validation fails
        }

        const dataToSave = {
            ...currentFormState,
            languagesSpoken: Array.isArray(currentFormState.languagesSpoken)
                ? currentFormState.languagesSpoken.map(String)
                : [],
            qualifications: Array.isArray(currentFormState.qualifications)
                ? currentFormState.qualifications.map(String)
                : [],
        };
        // Remove validationErrors from the data being saved (it's client-side state)
        delete dataToSave.validationErrors;

        setIsEditing(false); // Switch back to view mode on successful save
        if (onSave) {
            onSave(dataToSave, clinicId); // Pass data and clinicId to parent
        }
    }, [formState, onSave, validateDoctorData, clinicId, hasAvailabilityErrors]); // Dependencies: `formState`, `onSave`, `validateDoctorData`, `clinicId`, `hasAvailabilityErrors`.

    // `handleCancel`: Reverts changes and exits editing mode.
    // If it's a new doctor, it calls `onRemove` to discard the new doctor entry.
    // Otherwise, it resets `formState` to the original `doctor` data and clears validation errors.
    const handleCancel = useCallback(() => {
        if (isNewDoctor) {
            if (onRemove) {
                onRemove(doctor.id); // Use temporary ID to remove the new doctor card
            }
        } else {
            // Reset formState to original doctor data and clear errors
            setFormState({
                ...doctor,
                languagesSpoken: Array.isArray(doctor.languagesSpoken)
                    ? doctor.languagesSpoken.map(String)
                    : [],
                qualifications: Array.isArray(doctor.qualifications)
                    ? doctor.qualifications.map(String)
                    : [],
                validationErrors: {},
            });
            setIsEditing(false);
            // Optionally collapse details on cancel, or leave as is based on UX preference
            // setIsDetailsExpanded(false);
        }
    }, [isNewDoctor, onRemove, doctor]); // Dependencies: `isNewDoctor`, `onRemove` prop, `doctor` prop.

    // `handleInputChange`: Generic handler for updating form fields.
    // It updates the corresponding field in `formState` and re-validates if necessary (though full validation happens on save).
    // Ensures `languagesSpoken` and `qualifications` are always arrays of strings.
    const handleInputChange = useCallback(
        (field, value) => {
            let newValue = value;
            if (field === 'languagesSpoken' || field === 'qualifications') {
                newValue = Array.isArray(value) ? value.map(String) : [];
            }

            setFormState((prevState) => {
                const updatedState = { ...prevState, [field]: newValue };
                // Optionally, perform live validation for the changed field or clear its specific error
                const errors = validateDoctorData(updatedState); // Re-validate or validate field-specifically
                return { ...updatedState, validationErrors: errors };
            });
        },
        [validateDoctorData] // Dependency: `validateDoctorData` for re-validation.
    );

    // `handlePhoneNumberChange`: Updates a specific phone number in the `formState.phoneNumbers` array.
    const handlePhoneNumberChange = useCallback((index, value) => {
        setFormState((prevState) => ({
            ...prevState,
            phoneNumbers: prevState.phoneNumbers.map((item, i) =>
                i === index ? { ...item, phoneNumber: value } : item
            ),
        }));
    }, []); // No external state dependencies other than `setFormState`.

    // `handleAvailabilityChange`: Updates the `doctorAvailability` array in `formState`.
    const handleAvailabilityChange = useCallback((newAvailability) => {
        setFormState((prevState) => ({ ...prevState, doctorAvailability: newAvailability }));
    }, []); // No external state dependencies.

    // `handleAutocompleteBlur`: Adds the currently typed input value to Autocomplete fields (languages, qualifications)
    // when the field loses focus (onBlur), if the value is not empty and not already present.
    const handleAutocompleteBlur = useCallback(
        (field, inputValue) => {
            if (inputValue && inputValue.trim() !== '') {
                setFormState((prevState) => {
                    const currentValues = prevState[field] || [];
                    if (!currentValues.includes(inputValue.trim())) {
                        const updatedValues = [...currentValues, inputValue.trim()];
                        const nextState = { ...prevState, [field]: updatedValues };
                        // Re-validate after adding the new item
                        const errors = validateDoctorData(nextState);
                        return { ...nextState, validationErrors: errors };
                    }
                    return prevState; // No change if value already exists or is empty
                });
            }
        },
        [validateDoctorData] // Dependency: `validateDoctorData`.
    );

    // Refs to store the current input value of Autocomplete components, used by `handleAutocompleteBlur`.
    const languagesInputRef = React.useRef('');
    const qualificationsInputRef = React.useRef('');

    // Pre-processes `doctor.doctorAvailability` to ensure `consultationTime` is a number.
    // This is used for display purposes in view mode.
    const normalizedDoctorAvailability = (doctor.doctorAvailability || []).map((item) => ({
        ...item,
        consultationTime:
            typeof item.consultationTime === 'string'
                ? Number(item.consultationTime) // Convert to number if it's a string
                : item.consultationTime,
    }));

    // Unique ID for the expandable details section, used for ARIA attributes.
    const detailsId = `doctor-details-section-${doctor.id || doctor.doctorId}`;

    // Handler for keyboard events on the expandable card header.
    const handleCardHeaderKeyDown = useCallback(
        (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent default space scroll or enter behavior
                handleExpandDetails();
            }
        },
        [handleExpandDetails]
    );

    // Rendering Logic:
    // The component renders a Material-UI `Card`.
    // The card header (Avatar and Doctor Name) is clickable to expand/collapse details.
    // It conditionally renders form fields (if `isEditing` is true) or display text (if `isEditing` is false).
    // Buttons for "Edit", "Save", "Cancel", "Remove" are displayed based on the mode.
    // `DoctorPhoneNumbers` and `DoctorAvailability` are child components for managing those specific fields.

    return (
        <Card sx={{ mt: 2, boxShadow: 3, borderRadius: 2 }}>
            {' '}
            {/* Added subtle shadow and border radius */}
            <CardContent>
                {/* Card Header: Avatar and Doctor Name. Clickable to expand/collapse details. */}
                {/* Keyboard Accessibility: role="button", tabIndex="0", onKeyDown, aria-expanded, aria-controls */}
                <Box
                    component="div" // Using Box with appropriate ARIA roles instead of nested Card for header
                    role="button"
                    tabIndex="0"
                    onClick={handleExpandDetails}
                    onKeyDown={handleCardHeaderKeyDown}
                    aria-expanded={isDetailsExpanded}
                    aria-controls={detailsId}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: 1, // Added some padding
                        borderRadius: 1, // Rounded corners for the clickable area
                        '&:focus-visible': {
                            // Enhanced focus styling
                            outline: '2px solid primary.main',
                            outlineOffset: '2px',
                        },
                    }}
                >
                    <Avatar alt={doctor.doctorName} src={avatar} sx={{ width: 56, height: 56 }} />{' '}
                    {/* Slightly larger avatar */}
                    <Typography variant="h5" component="h2" sx={{ ml: 2, flexGrow: 1 }}>
                        {formState.doctorName || doctor.doctorName || 'New Doctor'}{' '}
                        {/* Display name from formState or prop */}
                    </Typography>
                    {/* Optional: Add an icon to indicate expand/collapse state */}
                    {/* <IconButton size="small">
                        <ExpandMoreIcon sx={{ transform: isDetailsExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </IconButton> */}
                </Box>

                {/* Expandable Details Section: Content is visible if `isDetailsExpanded` is true. */}
                {isDetailsExpanded && (
                    <Box
                        id={detailsId} // ID for aria-controls
                        display="flex"
                        flexDirection="column"
                        gap={2} // Consistent spacing between elements
                        sx={{ pt: 2 }} // Padding top for separation from header
                    >
                        {isEditing ? (
                            // EDITING MODE: Render form fields
                            <>
                                <TextField
                                    label="Doctor Name"
                                    value={formState.doctorName || ''}
                                    onChange={(e) =>
                                        handleInputChange('doctorName', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorName}
                                    helperText={formState.validationErrors.doctorName}
                                    fullWidth // Responsive width
                                    required
                                />
                                <TextField
                                    label="Doctor ID"
                                    // For new doctors, doctorId might be backend-generated or user-input.
                                    // If it's backend-generated after save, it might be read-only here or handled differently.
                                    value={formState.doctorId || ''}
                                    onChange={(e) => handleInputChange('doctorId', e.target.value)}
                                    error={!!formState.validationErrors.doctorId}
                                    helperText={formState.validationErrors.doctorId}
                                    fullWidth
                                    required
                                    // disabled={!isNewDoctor && !!doctor.doctorId} // Example: Disable if already set and not a new doctor
                                />
                                <RadioGroup
                                    row
                                    aria-label="Gender" // ARIA label for the group
                                    name="gender"
                                    value={formState.gender || 'Male'} // Default to Male if not set
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
                                    {/* Consider adding "Other" if applicable */}
                                </RadioGroup>
                                <TextField
                                    label="Email"
                                    type="email" // Use type="email" for basic browser validation
                                    value={formState.doctorEmail || ''}
                                    onChange={(e) =>
                                        handleInputChange('doctorEmail', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorEmail} // Assuming you add email validation
                                    helperText={formState.validationErrors.doctorEmail}
                                    fullWidth
                                />
                                <TextField
                                    label="Doctor Specialty"
                                    value={formState.doctorSpeciality || ''}
                                    onChange={(e) =>
                                        handleInputChange('doctorSpeciality', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorSpeciality}
                                    helperText={formState.validationErrors.doctorSpeciality}
                                    fullWidth
                                    required
                                />
                                <TextField
                                    label="Doctor Experience (years)"
                                    value={formState.doctorExperience || ''}
                                    onChange={(e) =>
                                        handleInputChange('doctorExperience', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorExperience}
                                    helperText={formState.validationErrors.doctorExperience}
                                    type="number" // Use type="number"
                                    fullWidth
                                    required
                                    inputProps={{
                                        min: 0, // Experience cannot be negative
                                        max: 70, // Max 70 years
                                        // maxLength: 2 is not standard for type="number", min/max handles range.
                                    }}
                                />
                                <TextField
                                    label="Consultation Fee - Appointment (₹)"
                                    value={formState.doctorConsultationFee || ''}
                                    onChange={(e) =>
                                        handleInputChange('doctorConsultationFee', e.target.value)
                                    }
                                    error={!!formState.validationErrors.doctorConsultationFee}
                                    helperText={formState.validationErrors.doctorConsultationFee}
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }} // Fee cannot be negative
                                />
                                <TextField
                                    label="Consultation Fee - Queue (₹)"
                                    value={formState.doctorConsultationFeeOther || ''}
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
                                    type="number"
                                    fullWidth
                                    required
                                    inputProps={{ min: 0 }} // Fee cannot be negative
                                />
                                {/* Autocomplete for Languages Spoken */}
                                <Autocomplete
                                    multiple // Allows multiple selections
                                    freeSolo // Allows adding new, custom values
                                    options={[]} // No predefined options, users add their own
                                    value={formState.languagesSpoken || []} // Controlled component value
                                    onChange={(event, value) =>
                                        handleInputChange('languagesSpoken', value)
                                    }
                                    onInputChange={(event, newInputValue) => {
                                        languagesInputRef.current = newInputValue; // Track current input for blur handling
                                    }}
                                    onBlur={() => {
                                        // Add typed value on blur
                                        handleAutocompleteBlur(
                                            'languagesSpoken',
                                            languagesInputRef.current
                                        );
                                        languagesInputRef.current = ''; // Clear ref
                                    }}
                                    renderTags={(
                                        value,
                                        getTagProps // Custom rendering for selected tags (chips)
                                    ) =>
                                        value.map((option, index) => {
                                            const { key, ...chipProps } = getTagProps({ index });
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
                                    renderInput={(
                                        params // Renders the input field
                                    ) => (
                                        <TextField
                                            {...params}
                                            variant="outlined"
                                            label="Languages Spoken"
                                            placeholder="Type and press Enter or Tab"
                                            fullWidth
                                        />
                                    )}
                                    sx={{ mt: 1 }} // Margin top for spacing
                                />
                                {/* Autocomplete for Qualifications */}
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={formState.qualifications || []}
                                    onChange={(event, value) =>
                                        handleInputChange('qualifications', value)
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
                                            const { key, ...chipProps } = getTagProps({ index });
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
                                            placeholder="Type and press Enter or Tab"
                                            fullWidth
                                        />
                                    )}
                                    sx={{ mt: 1 }}
                                />
                                {/* Component for managing phone numbers */}
                                <DoctorPhoneNumbers
                                    phoneNumbers={formState.phoneNumbers || [{ phoneNumber: '' }]} // Ensure at least one input
                                    onPhoneNumberChange={handlePhoneNumberChange}
                                    isEditing={isEditing}
                                />
                                {/* Component for managing availability */}
                                <DoctorAvailability
                                    // Ensure availability data is properly structured and consultationTime is a number
                                    availability={(formState.doctorAvailability || []).map(
                                        (item) => ({
                                            ...item,
                                            consultationTime: Number(item.consultationTime) || 0,
                                        })
                                    )}
                                    onAvailabilityChange={handleAvailabilityChange}
                                    isEditing={isEditing}
                                    onValidationStateChange={setHasAvailabilityErrors}
                                />
                                {/* Action Buttons for Edit Mode */}
                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="flex-end" // Align buttons to the right
                                    gap={1} // Spacing between buttons
                                    sx={{ flexDirection: { xs: 'column', sm: 'row' } }} // Stack on small screens
                                >
                                    <Button
                                        variant="contained" // Changed to contained for primary action
                                        onClick={handleSave}
                                        aria-label={`Save changes for ${formState.doctorName || 'new doctor'}`}
                                        sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on xs
                                        disabled={hasAvailabilityErrors}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleCancel}
                                        aria-label={`Cancel editing for ${formState.doctorName || 'new doctor'}`}
                                        sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on xs
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            // VIEW MODE: Display doctor information as text
                            <>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Doctor ID:</strong> {doctor.doctorId}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Gender:</strong> {doctor.gender}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Email:</strong> {doctor.doctorEmail || 'N/A'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Specialty:</strong> {doctor.doctorSpeciality}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Experience:</strong> {doctor.doctorExperience} years
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Consultation Fee (Appointment):</strong> ₹
                                    {doctor.doctorConsultationFee}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Consultation Fee (Queue):</strong> ₹
                                    {doctor.doctorConsultationFeeOther}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Languages Spoken:</strong>{' '}
                                    {Array.isArray(doctor.languagesSpoken) &&
                                    doctor.languagesSpoken.length > 0
                                        ? doctor.languagesSpoken.join(', ')
                                        : 'N/A'}
                                </Typography>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    <strong>Qualifications:</strong>{' '}
                                    {Array.isArray(doctor.qualifications) &&
                                    doctor.qualifications.length > 0
                                        ? doctor.qualifications.join(', ')
                                        : 'N/A'}
                                </Typography>
                                {/* Display phone numbers (view mode) */}
                                <DoctorPhoneNumbers
                                    phoneNumbers={doctor.phoneNumbers || []}
                                    onPhoneNumberChange={() => {}} // No-op in view mode
                                    isEditing={false}
                                />
                                {/* Display availability (view mode) */}
                                <DoctorAvailability
                                    availability={normalizedDoctorAvailability}
                                    onAvailabilityChange={() => {}} // No-op in view mode
                                    isEditing={false}
                                />
                                {/* Action Buttons for View Mode */}
                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    gap={1}
                                    sx={{ flexDirection: { xs: 'column', sm: 'row' } }} // Stack on small screens
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={handleEdit}
                                        aria-label={`Edit details for ${doctor.doctorName}`}
                                        sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on xs
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleRemove}
                                        aria-label={`Remove ${doctor.doctorName}`}
                                        sx={{ width: { xs: '100%', sm: 'auto' } }} // Full width on xs
                                    >
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

// PropTypes for type checking. Ensures that the component receives props of the correct type.
DoctorCard.propTypes = {
    doctor: PropTypes.shape({
        id: PropTypes.any.isRequired, // Can be string or number, unique identifier
        doctorName: PropTypes.string, // Name is not strictly required initially for a new doctor
        doctorId: PropTypes.string, // Doctor ID might be assigned after creation for a new doctor
        clinicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Not always present for a new doctor object initially
        doctorSpeciality: PropTypes.string,
        doctorExperience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Can be string then converted
        doctorConsultationFee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        doctorConsultationFeeOther: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        gender: PropTypes.string,
        doctorEmail: PropTypes.string,
        phoneNumbers: PropTypes.arrayOf(
            PropTypes.shape({
                phoneNumber: PropTypes.string,
            })
        ),
        doctorAvailability: PropTypes.arrayOf(
            PropTypes.shape({
                availableDays: PropTypes.string,
                shiftTime: PropTypes.string,
                shiftStartTime: PropTypes.string,
                shiftEndTime: PropTypes.string,
                consultationTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                configType: PropTypes.string,
            })
        ),
        languagesSpoken: PropTypes.arrayOf(PropTypes.string),
        qualifications: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isNewDoctor: PropTypes.bool, // Flag indicating if this is a card for a new, unsaved doctor
    onSave: PropTypes.func.isRequired, // Function to call when saving doctor details
    onRemove: PropTypes.func.isRequired, // Function to call when removing a doctor or cancelling a new one
    clinicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Clinic ID, might not be present for a brand new card before association
};

export default DoctorCard;

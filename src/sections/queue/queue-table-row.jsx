import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
const PATIENT_REACHED = '/api/queue/patientReached/';
const PATIENT_CANCELLED = '/api/queue/patientCancelled/';
const PATIENT_VISIT_DONE = '/api/queue/patientVisited/';
const PATIENT_SKIP = '/api/queue/patientSkip/';

export default function QueueTableRow({
    selected,
    id,
    patientName,
    avatarUrl,
    doctorName,
    shiftTime,
    patientReached,
    patientPhoneNumber,
    queueNo,
    time,
    handleClick,
    onQueueUpdate,
}) {
    const [open, setOpen] = useState(null);

    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = async () => {
        console.log('handleCloseMenu');
        setOpen(null);
    };

    const handlePatientReachedMenu = async (event) => {
        try {
            console.log(id);
            await axios.put(PATIENT_REACHED + id);
            setOpen(null);
            if (onQueueUpdate) {
                onQueueUpdate(); // Invoke the callback to reload the queue data
            }
        } catch (error) {
            console.error('Failed to update patient reached status:', error);
        }
    };

    const handleCancelPatient = async (event) => {
        try {
            console.log(id);
            await axios.put(PATIENT_CANCELLED + id);
            setOpen(null);
            if (onQueueUpdate) {
                onQueueUpdate(); // Invoke the callback to reload the queue data
            }
        } catch (error) {
            console.error('Failed to update patient cancelled status:', error);
        }
    };

    const handlePatientVisitDone = async (event) => {
        try {
            console.log(id);
            await axios.put(PATIENT_VISIT_DONE + id);
            setOpen(null);
            if (onQueueUpdate) {
                onQueueUpdate(); // Invoke the callback to reload the queue data
            }
        } catch (error) {
            console.error('Failed to update patient visited status:', error);
        }
    };

    const handleSkipPatient = async () => {
        try {
            console.log(id);
            await axios.put(PATIENT_SKIP + id);
            setOpen(null);
            if (onQueueUpdate) {
                onQueueUpdate(); // Invoke the callback to reload the queue data
            }
        } catch (error) {
            console.error('Failed to update patient visited status:', error);
        }
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>

                <TableCell component="th" scope="row" padding="none" sx={{ minWidth: 180 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={patientName} src={avatarUrl} />
                        <Typography variant="subtitle2" noWrap>
                            {patientName}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>{doctorName}</TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>
                    {shiftTime}
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>
                    {queueNo}
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 180 }}>
                    {patientPhoneNumber}
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 140 }}>
                    <Label color={(patientReached === 'false' && 'error') || 'success'}>
                        {patientReached === 'true' ? 'Yes' : 'No'}
                    </Label>
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 120 }}>
                    {time}
                </TableCell>
                <TableCell sx={{ display: 'none' }}>{id}</TableCell>
                <TableCell align="right" sx={{ minWidth: 60 }}>
                    <IconButton onClick={handleOpenMenu} aria-label="open actions menu">
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>

            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 },
                }}
            >
                <MenuItem onClick={handlePatientReachedMenu} sx={{ color: 'orange' }}>
                    Patient Reached
                </MenuItem>

                <MenuItem onClick={handleSkipPatient} sx={{ color: 'error.main' }}>
                    Skip Patient
                </MenuItem>

                <MenuItem onClick={handleCancelPatient} sx={{ color: 'error.main' }}>
                    Cancel
                </MenuItem>

                <MenuItem onClick={handlePatientVisitDone} sx={{ color: 'green' }}>
                    Visit Done
                </MenuItem>
            </Popover>
        </>
    );
}

QueueTableRow.propTypes = {
    avatarUrl: PropTypes.any,
    patientName: PropTypes.any,
    doctorName: PropTypes.any,
    shiftTime: PropTypes.any,
    patientReached: PropTypes.any,
    patientPhoneNumber: PropTypes.any,
    queueNo: PropTypes.any,
    time: PropTypes.any,
    selected: PropTypes.any,
    id: PropTypes.any,
    handleClick: PropTypes.func,
    onQueueUpdate: PropTypes.func,
};

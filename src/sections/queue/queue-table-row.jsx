import axios from 'axios';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

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
    const handlePatientReachedMenu = async (event) => {
        try {
            console.log(id);
            await axios.put(PATIENT_REACHED + id);
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
            if (onQueueUpdate) {
                onQueueUpdate(); // Invoke the callback to reload the queue data
            }
        } catch (error) {
            console.error('Failed to update patient visited status:', error);
        }
    };

    return (
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
            <TableCell align="right" sx={{ minWidth: 200 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Mark patient as arrived">
                        <IconButton onClick={handlePatientReachedMenu} aria-label="Patient Reached">
                            <span role="img" aria-label="Patient Reached">
                                ✅
                            </span>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Move patient down the queue">
                        <IconButton onClick={handleSkipPatient} aria-label="Skip Patient">
                            <span role="img" aria-label="Skip Patient">
                                ⏭️
                            </span>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove patient from queue">
                        <IconButton onClick={handleCancelPatient} aria-label="Cancel">
                            <span role="img" aria-label="Cancel">
                                ❌
                            </span>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Mark visit as completed">
                        <IconButton onClick={handlePatientVisitDone} aria-label="Visit Done">
                            <span role="img" aria-label="Visit Done">
                                🏁
                            </span>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>
        </TableRow>
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

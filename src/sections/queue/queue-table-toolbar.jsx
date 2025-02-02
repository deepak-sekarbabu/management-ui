import axios from 'axios';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

export default function QueueTableToolbar({
    numSelected,
    filterName,
    onFilterName,
    selectedIds,
    onQueueUpdate,
    setSelected,
    setSelectedIds,
}) {
    const PATIENT_DELETE = '/api/queue/patientDelete/';
    const handleDelete = async () => {
        try {
            console.log('Deleting queue items:', selectedIds);

            // Convert to array if not already
            const idsToDelete = Array.isArray(selectedIds) ? selectedIds : [selectedIds];

            // Delete items in parallel
            await Promise.all(
                idsToDelete.map(async (id) => {
                    try {
                        await axios.put(PATIENT_DELETE + id);
                        console.log(`Successfully deleted item ${id}`);
                    } catch (error) {
                        console.error(`Error deleting item ${id}:`, error);
                        // Continue with next deletion even if one fails
                    }
                })
            );

            // Update queue after all deletions
            onQueueUpdate();

            // Reset selected items
            setSelected([]);
            setSelectedIds([]);
        } catch (error) {
            console.error('Error in delete operation:', error);
        }
    };

    return (
        <Toolbar
            sx={{
                height: 96,
                display: 'flex',
                justifyContent: 'space-between',
                p: (theme) => theme.spacing(0, 1, 0, 3),
                ...(numSelected > 0 && {
                    color: 'primary.main',
                    bgcolor: 'primary.lighter',
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography component="div" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <OutlinedInput
                    value={filterName}
                    onChange={onFilterName}
                    placeholder="Search Patient..."
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify
                                icon="eva:search-fill"
                                sx={{ color: 'text.disabled', width: 20, height: 20 }}
                            />
                        </InputAdornment>
                    }
                />
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleDelete}>
                        <Iconify icon="eva:trash-2-fill" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <Iconify icon="ic:round-filter-list" />
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    );
}

QueueTableToolbar.propTypes = {
    numSelected: PropTypes.number,
    filterName: PropTypes.string,
    onFilterName: PropTypes.func,
    selectedIds: PropTypes.array,
    onQueueUpdate: PropTypes.func,
    setSelected: PropTypes.func,
    setSelectedIds: PropTypes.func,
};

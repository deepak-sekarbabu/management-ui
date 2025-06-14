import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import Scrollbar from 'src/components/scrollbar';

import QueueEmptyRows from '../queue-empty-rows';
import QueueNoData from '../queue-no-data';
import QueueTableHead from '../queue-table-head';
import QueueTableRow from '../queue-table-row';
import QueueTableToolbar from '../queue-table-toolbar';
import { applyFilter, emptyRows, getComparator } from '../utils';

// Define the API URL
const QUEUE_INFO = '/api/queue/details';
const DOCTOR_CLINIC_INFO = '/api/doctor-clinic';
const CLINIC_ID = 1;

export const fetchDoctorInfo = async () => {
    try {
        const response = await axios.get(`${DOCTOR_CLINIC_INFO}/${CLINIC_ID}`);
        return response.data.map(({ doctorId, doctorName }) => ({
            id: doctorId,
            name: doctorName,
        }));
    } catch (error) {
        console.error('Error fetching doctor information:', error);
        return [];
    }
};

// Function to fetch queue information from the server
export const getQueue = async (clinicId, doctorId) => {
    try {
        const response = await axios.get(`${QUEUE_INFO}/${CLINIC_ID}/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// ----------------------------------------------------------------------

export default function QueuePage() {
    const [selectedIds, setSelectedIds] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [queueInfo, setQueueInfo] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [shiftTimeFilter, setShiftTimeFilter] = useState('');
    const [patientReachedFilter, setPatientReachedFilter] = useState('');

    const fetchQueueInfo = useCallback(async () => {
        try {
            const data = await getQueue(CLINIC_ID, selectedDoctorId);
            setQueueInfo(data);
        } catch (error) {
            console.error('Error fetching queue information:', error);
        }
    }, [selectedDoctorId]);

    const handleDoctorChange = (event) => {
        setSelectedDoctorId(event.target.value);
    };

    useEffect(() => {
        const loadDoctors = async () => {
            const doctorData = await fetchDoctorInfo();
            setDoctorOptions(doctorData);
            if (doctorData.length > 0) {
                setSelectedDoctorId(doctorData[0].id);
            }
        };
        loadDoctors();
    }, []);

    useEffect(() => {
        if (selectedDoctorId) {
            fetchQueueInfo();
        }
    }, [selectedDoctorId, fetchQueueInfo]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            // Select all patients and their IDs
            const newSelectedNames = queueInfo.map((n) => n.patientName);
            const newSelectedIds = queueInfo.map((n) => n.id);
            setSelected(newSelectedNames);
            setSelectedIds(newSelectedIds);
            return;
        }
        // Clear selections
        setSelected([]);
        setSelectedIds([]);
    };

    // Modify handleClick to track IDs along with names
    const handleClick = (event, patientName, rowId) => {
        const selectedIndex = selected.indexOf(patientName);
        let newSelected = [];
        let newSelectedIds = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, patientName];
            newSelectedIds = [...selectedIds, rowId];
        } else if (selectedIndex === 0) {
            newSelected = selected.slice(1);
            newSelectedIds = selectedIds.slice(1);
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.slice(0, -1);
            newSelectedIds = selectedIds.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ];
            newSelectedIds = [
                ...selectedIds.slice(0, selectedIndex),
                ...selectedIds.slice(selectedIndex + 1),
            ];
        }

        setSelected(newSelected);
        setSelectedIds(newSelectedIds);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const dataFiltered = applyFilter({
        inputData: queueInfo,
        comparator: getComparator(order, orderBy),
        filterName,
        shiftTimeFilter,
        patientReachedFilter,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Card>
            <Stack p={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{ pl: 3, pt: 2, color: 'primary.main', fontWeight: 'bold' }}
                >
                    Queue Information
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <InputLabel htmlFor="doctor-select" sx={{ marginRight: '20px' }}>
                        Doctor
                    </InputLabel>
                    <Select
                        id="doctor-select"
                        value={selectedDoctorId}
                        onChange={handleDoctorChange}
                        displayEmpty
                        aria-label="Select doctor"
                    >
                        {doctorOptions.map((doctor) => (
                            <MenuItem key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Stack>

            <Card>
                <QueueTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                    selectedIds={selectedIds}
                    onQueueUpdate={fetchQueueInfo}
                    setSelected={setSelected}
                    setSelectedIds={setSelectedIds}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <QueueTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={queueInfo.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'patientName', label: 'Patient Name' },
                                    { id: 'doctorName', label: 'Doctor Name' },
                                    { id: 'shiftTime', label: 'Shift Time' },
                                    { id: 'queueNo', label: 'Queue No' },
                                    {
                                        id: 'patientPhoneNumber',
                                        label: 'Patient Phone Number',
                                        align: 'center',
                                    },
                                    {
                                        id: 'patientReached',
                                        label: 'Patient Reached',
                                        align: 'center',
                                    },
                                    { id: 'time', label: 'Queue Time' },
                                    { id: '' },
                                ]}
                                shiftTimeFilter={shiftTimeFilter}
                                setShiftTimeFilter={setShiftTimeFilter}
                                patientReachedFilter={patientReachedFilter}
                                setPatientReachedFilter={setPatientReachedFilter}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <QueueTableRow
                                            key={row.id}
                                            avatarUrl={row.avatarUrl}
                                            patientName={row.patientName}
                                            doctorName={row.doctorName}
                                            shiftTime={row.shiftTime}
                                            queueNo={row.queueNo}
                                            patientReached={row.patientReached}
                                            patientPhoneNumber={row.patientPhoneNumber}
                                            time={row.time}
                                            id={row.id}
                                            selected={selected.indexOf(row.patientName) !== -1}
                                            handleClick={(event) =>
                                                handleClick(event, row.patientName, row.id)
                                            }
                                            onQueueUpdate={fetchQueueInfo}
                                        />
                                    ))}

                                <QueueEmptyRows
                                    height={80}
                                    emptyRows={emptyRows(page, rowsPerPage, queueInfo.length)}
                                />
                                {notFound && <QueueNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={queueInfo.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Card>
    );
}

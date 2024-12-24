import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import QueueNoData from '../queue-no-data';
import QueueTableRow from '../queue-table-row';
import QueueTableHead from '../queue-table-head';
import QueueEmptyRows from '../queue-empty-rows';
import QueueTableToolbar from '../queue-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// Define the API URL
const QUEUE_INFO = '/api/queue/details';
const DOCTOR_CLINIC_INFO = '/api/doctor-clinic';

export const fetchDoctorInfo = async () => {
    try {
        const response = await axios.get(DOCTOR_CLINIC_INFO);
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
export const getQueue = async () => {
    try {
        const response = await axios.get(QUEUE_INFO);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// ----------------------------------------------------------------------

export default function QueuePage() {
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [queueInfo, setQueueInfo] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [doctor, setDoctor] = useState('');

    const fetchQueueInfo = async () => {
        try {
            const data = await getQueue(); // Call the getQueue function
            setQueueInfo(data); // Update queueInfo state with the fetched data
        } catch (error) {
            console.error('Error fetching queue information:', error);
        }
    };

    const handleDoctorChange = async (event) => {
        const selectedDoctorId = event.target.value;
        setDoctor(selectedDoctorId);
        try {
            // Update the API call to use the correct endpoint 1 is clinic id
            const response = await axios.get(`${QUEUE_INFO}/1/${selectedDoctorId}`);
            if (response.data) {
                setQueueInfo(response.data);
            } else {
                setQueueInfo([]); // Set empty array if no data
            }
        } catch (error) {
            console.error('Error fetching queue information for the selected doctor:', error);
            setQueueInfo([]); // Set empty array on error
        }
    };

    useEffect(() => {
        fetchQueueInfo();
    }, []);

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const data = await fetchDoctorInfo();
                setDoctorOptions(data);
                if (data.length > 0) {
                    setDoctor(data[0].id);
                    // Fetch initial queue data for the first doctor
                    const response = await axios.get(`${QUEUE_INFO}/${data[0].id}`);
                    setQueueInfo(response.data);
                }
            } catch (error) {
                console.error('Error fetching doctor information:', error);
            }
        };
        fetchDoctorData();
    }, []);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = queueInfo.map((n) => n.patientName);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, patientName) => {
        const selectedIndex = selected.indexOf(patientName);
        console.log(`Selected index for ${patientName}:`, selectedIndex); // Log the initial selected index

        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, patientName];
        } else if (selectedIndex === 0) {
            newSelected = selected.slice(1);
        } else if (selectedIndex === selected.length - 1) {
            newSelected = selected.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selected.slice(0, selectedIndex),
                ...selected.slice(selectedIndex + 1),
            ];
        }

        console.log(`New selected array:`, newSelected); // Log the new selected array
        setSelected(newSelected);
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
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Card>
            <Stack p={2} direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h2" justifyContent="flex">
                    Queue Information
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="flex-end">
                    <InputLabel htmlFor="doctor-select" sx={{ marginRight: '20px' }}>
                        Doctor
                    </InputLabel>
                    <Select value={doctor} onChange={handleDoctorChange} id="doctor-select">
                        {doctorOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
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
                                                handleClick(event, row.patientName)
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

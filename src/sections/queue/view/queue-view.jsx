import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// import { queueInfo } from 'src/_mock/queue';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../queue-no-data';
import QueueTableRow from '../queue-table-row';
import UserTableHead from '../queue-table-head';
import TableEmptyRows from '../queue-empty-rows';
import UserTableToolbar from '../queue-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// Define the API URL
const API_URL = '/api/queue/details';

// Function to fetch queue information from the server
export const getQueue = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// ----------------------------------------------------------------------

export default function QueuePage() {
    const [queueInfo, setQueueInfo] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchQueueInfo = async () => {
            try {
                const data = await getQueue(); // Call the getQueue function
                setQueueInfo(data); // Update queueInfo state with the fetched data
            } catch (error) {
                console.error('Error fetching queue information:', error);
            }
        };

        fetchQueueInfo();
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
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, patientName) => {
        const selectedIndex = selected.indexOf(patientName);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, patientName);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
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
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Queue Information</Typography>
            </Stack>

            <Card>
                <UserTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={queueInfo.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'patientName', label: 'Patient Name' },
                                    { id: 'doctorName', label: 'Doctor Name' },
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
                                            patientName={row.patientName}
                                            doctorName={row.doctorName}
                                            queueNo={row.queueNo}
                                            patientReached={row.patientReached}
                                            patientPhoneNumber={row.patientPhoneNumber}
                                            avatarUrl={row.avatarUrl}
                                            time={row.time}
                                            selected={selected.indexOf(row.patientName) !== -1}
                                            handleClick={(event) =>
                                                handleClick(event, row.patientName)
                                            }
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={80}
                                    emptyRows={emptyRows(page, rowsPerPage, queueInfo.length)}
                                />
                                {notFound && <TableNoData query={filterName} />}
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
        </Container>
    );
}

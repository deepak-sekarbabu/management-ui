import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------
// Function to generate appointment times in 10-minute intervals
function generateAppointmentTimes(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const times = [];
    while (start < end) {
        times.push(new Date(start));
        start.setMinutes(start.getMinutes() + 10); // Increment by 10 minutes
    }
    return times;
}

// Generate appointment times for the day
const startOfDay = new Date();
startOfDay.setHours(9, 0, 0, 0); // Assuming appointments start at 9:00 AM
const endOfDay = new Date();
endOfDay.setHours(22, 0, 0, 0); // Assuming appointments end at 5:00 PM
const appointmentTimes = generateAppointmentTimes(startOfDay, endOfDay);

export const queueInfo = [...Array(50)].map((_, index) => ({
    id: index + 1,
    avatarUrl: `/assets/images/avatars/avatar_${Math.floor(Math.random() * 25) + 1}.jpg`,
    patientName: faker.person.fullName(),
    doctorName: faker.person.fullName(),
    shift: sample('MORNING', 'EVENING'),
    queueNo: index + 1,
    patientPhoneNumber: faker.phone.number(),
    patientReached: sample(['true', 'false']),
    time: appointmentTimes[index % appointmentTimes.length].toString(),
}));


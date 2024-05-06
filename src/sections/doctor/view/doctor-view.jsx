import React from 'react';

import data from './data.json';
import DoctorCard from './DoctorCard';

const DoctorPage = () => (
    <div>
        {data.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} />
        ))}
    </div>
);

export default DoctorPage;

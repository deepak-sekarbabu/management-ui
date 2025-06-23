import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
    {
        title: 'dashboard',
        path: '/',
        icon: icon('ic_analytics'),
        roles: ['admin', 'nurse', 'doctor'],
    },
    {
        title: 'user',
        path: '/user',
        icon: icon('ic_user'),
        roles: ['admin'],
    },
    {
        title: 'clinic',
        path: '/clinic',
        icon: icon('ic_user'),
        roles: ['admin', 'nurse', 'doctor'],
    },
    {
        title: 'doctor',
        path: '/doctor',
        icon: icon('ic_user'),
        roles: ['admin', 'nurse', 'doctor'],
    },
    {
        title: 'doctorabsence',
        path: '/doctorabsence',
        icon: icon('ic_user'),
        roles: ['admin', 'nurse', 'doctor'],
    },
    {
        title: 'queue',
        path: '/queue',
        icon: icon('ic_user'),
        roles: ['admin', 'nurse', 'doctor'],
    },
    {
        title: 'add patient & appointment',
        path: '/add-patient-appointment',
        icon: icon('ic_user'),
        roles: ['nurse', 'doctor', 'admin'],
    },
];

export default navConfig;

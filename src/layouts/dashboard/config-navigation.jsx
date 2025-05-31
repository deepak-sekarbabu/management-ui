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
    },
    {
        title: 'user',
        path: '/user',
        icon: icon('ic_user'),
    },
    {
        title: 'clinic',
        path: '/clinic',
        icon: icon('ic_user'),
    },
    {
        title: 'doctor',
        path: '/doctor',
        icon: icon('ic_user'),
    },
    {
        title: 'doctorabsence',
        path: '/doctorabsence',
        icon: icon('ic_user'),
    },
    {
        title: 'queue',
        path: '/queue',
        icon: icon('ic_user'),
    },

];

export default navConfig;

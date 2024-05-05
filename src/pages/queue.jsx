import { Helmet } from 'react-helmet-async';

import { QueueView } from 'src/sections/queue/view';

// ----------------------------------------------------------------------

export default function QueuePage() {
    return (
        <>
            <Helmet>
                <title>Queue Status</title>
            </Helmet>
            <QueueView />
        </>
    );
}

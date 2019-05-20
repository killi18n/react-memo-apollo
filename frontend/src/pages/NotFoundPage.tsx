import React from 'react';
import { Helmet } from 'react-helmet';
import NotFound from '../components/common/NotFound';

const NotFoundPage = () => {
    return (
        <>
            <Helmet>
                <title>404 - 리액트 아폴로 메모</title>
            </Helmet>
            <NotFound />
        </>
    );
};

export default NotFoundPage;

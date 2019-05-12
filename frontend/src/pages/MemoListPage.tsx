import React from 'react';
import { Helmet } from 'react-helmet';
import Structure from 'components/base/Structure';

const MemoListPage = () => {
    return (
        <>
            <Helmet>
                <title>리액트 아폴로 메모</title>
            </Helmet>
            <Structure>MemoListPage</Structure>
        </>
    );
};

export default MemoListPage;

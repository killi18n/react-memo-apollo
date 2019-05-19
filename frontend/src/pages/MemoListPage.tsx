import React from 'react';
import { Helmet } from 'react-helmet';
import Structure from 'components/base/Structure';
import WriteContainer from 'containers/WriteContainer';
import MemoListContainer from 'containers/MemoListContainer';

const MemoListPage = () => {
    return (
        <>
            <Helmet>
                <title>리액트 아폴로 메모</title>
            </Helmet>
            <Structure>
                <WriteContainer />
                <MemoListContainer />
            </Structure>
        </>
    );
};

export default MemoListPage;

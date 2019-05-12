import React from 'react';
import { Helmet } from 'react-helmet';
import Structure from 'components/base/Structure';
import WriteContainer from 'containers/WriteContainer';

const MemoListPage = () => {
    return (
        <>
            <Helmet>
                <title>리액트 아폴로 메모</title>
            </Helmet>
            <Structure>
                <WriteContainer />
            </Structure>
        </>
    );
};

export default MemoListPage;

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MemoListPage, NotFoundPage } from 'pages';
import AuthModalContainer from 'containers/AuthModalContainer';
import CheckLogged from 'containers/CheckLogged';

const App = () => {
    return (
        <>
            <Switch>
                <Route exact={true} path="/" component={MemoListPage} />
                <Route component={NotFoundPage} />
            </Switch>
            <AuthModalContainer />
            <CheckLogged />
        </>
    );
};

export default App;

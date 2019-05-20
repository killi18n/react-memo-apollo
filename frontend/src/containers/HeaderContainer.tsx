import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalActions } from '../store/modules/modal';
import { State } from '../store/modules';
import Header from '../components/base/Header';
import { authActions } from '../store/modules/auth';

const HeaderContainer = () => {
    const dispatch = useDispatch();
    const ModalActions = bindActionCreators(modalActions, dispatch);
    const AuthActions = bindActionCreators(authActions, dispatch);

    const logged = useSelector(({ auth }: State) => auth.logged);
    const setLogged = (isLoggedIn: boolean) =>
        AuthActions.setLogged(isLoggedIn);

    return (
        <Header
            ModalActions={ModalActions}
            logged={logged}
            setLogged={setLogged}
        />
    );
};

export default HeaderContainer;

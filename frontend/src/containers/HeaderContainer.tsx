import React from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalActions } from 'store/modules/modal';
import { State } from 'store/modules';
import Header from 'components/base/Header';

const HeaderContainer = () => {
    const dispatch = useDispatch();
    const ModalActions = bindActionCreators(modalActions, dispatch);

    const logged = useSelector(({ auth }: State) => auth.logged);

    return <Header ModalActions={ModalActions} logged={logged} />;
};

export default HeaderContainer;

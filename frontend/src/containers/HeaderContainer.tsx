import React from 'react';
import { useDispatch } from 'react-redux';
import Header from 'components/base/Header';
import { actions as modalActions } from 'store/modules/modal';
import { bindActionCreators } from 'redux';

const HeaderContainer = () => {
    const dispatch = useDispatch();
    const ModalActions = bindActionCreators(modalActions, dispatch);

    return <Header ModalActions={ModalActions} />;
};

export default HeaderContainer;

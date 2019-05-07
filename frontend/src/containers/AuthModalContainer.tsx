import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from 'components/common/ModalWrapper';
import AuthModal from 'components/modal/AuthModal';
import { State } from 'store/modules';
import { bindActionCreators } from 'redux';
import { actions as modalActions } from 'store/modules/modal';

const AuthModalContainer = () => {
    const dispatch = useDispatch();
    const loginModalVisible = useSelector(
        ({ modal }: State) => modal.visible.login
    );
    const registerModalVisible = useSelector(
        ({ modal }: State) => modal.visible.register
    );

    const ModalActions = bindActionCreators(modalActions, dispatch);

    if (loginModalVisible) {
        return (
            <ModalWrapper
                visible={loginModalVisible}
                onClick={() => ModalActions.hideAllModal()}
            >
                <AuthModal type="login" />
            </ModalWrapper>
        );
    }

    if (registerModalVisible) {
        return (
            <ModalWrapper
                visible={registerModalVisible}
                onClick={() => ModalActions.hideAllModal()}
            >
                <AuthModal type="register" />
            </ModalWrapper>
        );
    }

    return null;
};

export default AuthModalContainer;

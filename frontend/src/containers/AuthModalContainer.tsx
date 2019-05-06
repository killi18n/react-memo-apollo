import React, { Component } from 'react';
import ModalWrapper from 'components/common/ModalWrapper';
import AuthModal from 'components/modal/AuthModal';

class AuthModalContainer extends Component {
    render() {
        return (
            <ModalWrapper>
                <AuthModal type="login" />
            </ModalWrapper>
        );
    }
}

export default AuthModalContainer;

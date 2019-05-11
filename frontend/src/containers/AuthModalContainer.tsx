import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from 'components/common/ModalWrapper';
import AuthModal from 'components/modal/AuthModal';
import { State } from 'store/modules';
import { bindActionCreators } from 'redux';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import {
    actions as modalActions,
    ModalVisiblePayload,
} from 'store/modules/modal';
import { NameValueType, GraphqlData } from 'types/common';
import { authActions, ErrorType } from 'store/modules/auth';

const CREATE_USER = gql`
    mutation CreateUser($name: String!, $password: String!) {
        createUser(name: $name, password: $password) {
            _id
            name
            jwt
        }
    }
`;

const FIND_USER_BY_NAME_AND_PASSWORD = gql`
    mutation FindUserByNameAndPassword($name: String!, $password: String!) {
        findUserByNameAndPassword(name: $name, password: $password) {
            _id
            name
            jwt
            error
        }
    }
`;

const AuthModalContainer = () => {
    const dispatch = useDispatch();
    const loginModalVisible = useSelector(
        ({ modal }: State) => modal.visible.login
    );
    const registerModalVisible = useSelector(
        ({ modal }: State) => modal.visible.register
    );
    const username = useSelector(({ modal }: State) => modal.input.username);
    const password = useSelector(({ modal }: State) => modal.input.password);

    const ModalActions = bindActionCreators(modalActions, dispatch);
    const AuthActions = bindActionCreators(authActions, dispatch);

    const hideModal = ({ name }: ModalVisiblePayload) =>
        ModalActions.hideModal({ name });
    const showModal = ({ name }: ModalVisiblePayload) =>
        ModalActions.showModal({ name });
    const changeInput = ({ name, value }: NameValueType) =>
        ModalActions.changeInput({ name, value });
    const initializeInput = () => ModalActions.initializeInput();
    const setLogged = () => AuthActions.setLogged();
    const setError = ({ errorNumber, description }: ErrorType) =>
        AuthActions.setError({ errorNumber, description });

    if (loginModalVisible) {
        return (
            <ModalWrapper
                visible={loginModalVisible}
                onClick={() => ModalActions.hideAllModal()}
            >
                <Mutation
                    mutation={FIND_USER_BY_NAME_AND_PASSWORD}
                    onCompleted={(loginPayload: any) => {
                        const { findUserByNameAndPassword } = loginPayload;
                        const {
                            jwt,
                            name,
                            _id,
                            error,
                        } = findUserByNameAndPassword;
                        if (jwt && name && _id) {
                            localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                    jwt,
                                    name,
                                    _id,
                                })
                            );
                            setLogged();
                            hideModal({ name: 'login' });
                            return;
                        }
                        if (error) {
                            // todo: Set error on redux
                            let description = '';

                            if (error === 404) {
                                description =
                                    '로그인 하고자 하는 아이디가 없습니다.';
                            }
                            if (error === 401) {
                                description = '패스워드가 일치하지 않습니다.';
                            }
                            setError({ errorNumber: error, description });
                        }
                    }}
                >
                    {(
                        findUserByNameAndPassword: any,
                        { data, error, loading }: GraphqlData
                    ) => {
                        return (
                            <AuthModal
                                type="login"
                                hideModal={hideModal}
                                showModal={showModal}
                                onChange={changeInput}
                                initializeInput={initializeInput}
                                username={username}
                                password={password}
                                onLogin={findUserByNameAndPassword}
                                loading={loading}
                            />
                        );
                    }}
                </Mutation>
            </ModalWrapper>
        );
    }

    if (registerModalVisible) {
        return (
            <ModalWrapper
                visible={registerModalVisible}
                onClick={() => ModalActions.hideAllModal()}
            >
                <Mutation
                    mutation={CREATE_USER}
                    onCompleted={(registerPayload: any) => {
                        if (registerPayload) {
                            const { createUser } = registerPayload;
                            const { jwt, name, _id } = createUser;
                            localStorage.setItem(
                                'userInfo',
                                JSON.stringify({
                                    jwt,
                                    name,
                                    _id,
                                })
                            );
                            setLogged();
                            hideModal({ name: 'register' });
                        }
                    }}
                >
                    {(
                        createUser: any,
                        { data, loading, error }: GraphqlData
                    ) => {
                        return (
                            <AuthModal
                                type="register"
                                hideModal={hideModal}
                                showModal={showModal}
                                onRegister={createUser}
                                onChange={changeInput}
                                initializeInput={initializeInput}
                                username={username}
                                password={password}
                                loading={loading}
                            />
                        );
                    }}
                </Mutation>
            </ModalWrapper>
        );
    }

    return null;
};

export default AuthModalContainer;

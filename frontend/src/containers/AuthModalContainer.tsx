import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { bindActionCreators } from 'redux';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import {
    actions as modalActions,
    ModalVisiblePayload,
} from '../store/modules/modal';
import ModalWrapper from '../components/common/ModalWrapper';
import AuthModal from '../components/modal/AuthModal';
import { State } from '../store/modules';
import { NameValueType, GraphqlData } from '../types/common';
import { authActions, ErrorType } from '../store/modules/auth';

const CREATE_USER = gql`
    mutation CreateUser($name: String!, $password: String!) {
        createUser(name: $name, password: $password) {
            _id
            name
            jwt
            error
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
    const errorDescription = useSelector(
        ({ auth }: State) => auth.error.description
    );

    const ModalActions = bindActionCreators(modalActions, dispatch);
    const AuthActions = bindActionCreators(authActions, dispatch);

    const hideModal = ({ name }: ModalVisiblePayload) =>
        ModalActions.hideModal({ name });
    const showModal = ({ name }: ModalVisiblePayload) =>
        ModalActions.showModal({ name });
    const changeInput = ({ name, value }: NameValueType) =>
        ModalActions.changeInput({ name, value });
    const initializeInput = () => ModalActions.initializeInput();
    const initializeError = () => AuthActions.initializeError();
    const setLogged = (isLoggedIn: boolean) =>
        AuthActions.setLogged(isLoggedIn);
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
                            typeof window !== 'undefined' &&
                                localStorage.setItem(
                                    'userInfo',
                                    JSON.stringify({
                                        jwt,
                                        name,
                                        _id,
                                    })
                                );
                            setLogged(true);
                            initializeInput();
                            initializeError();
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
                                errorDescription={errorDescription}
                                initializeError={initializeError}
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
                            const { jwt, name, _id, error } = createUser;
                            if (error) {
                                let description = '';
                                if (error === 400) {
                                    description =
                                        '아이디는 8자이상 20자 미만의 알파벳과 숫자로만 가능합니다.\n 비밀번호는 6자이상 30자미만으로 가능합니다.';
                                }
                                if (error === 409) {
                                    description =
                                        '이미 존재하는 아이디 입니다.';
                                }
                                setError({
                                    errorNumber: error,
                                    description,
                                });
                                return;
                            }
                            typeof window !== 'undefined' &&
                                localStorage.setItem(
                                    'userInfo',
                                    JSON.stringify({
                                        jwt,
                                        name,
                                        _id,
                                    })
                                );
                            setLogged(true);
                            initializeInput();
                            initializeError();
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
                                errorDescription={errorDescription}
                                initializeError={initializeError}
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

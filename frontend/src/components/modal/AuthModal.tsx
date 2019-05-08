import React from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { ModalVisiblePayload } from 'store/modules/modal';
import { NameValueType } from 'types/common';

const AuthForm = styled.div`
    background: #ffffff;
    height: auto;
    width: 425px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    &:hover {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25),
            0 10px 10px rgba(0, 0, 0, 0.22);
    }
    display: flex;
    flex-direction: column;
`;

const LabelWithInput = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.h2``;

const InputWrapper = styled.div`
    display: flex;
`;

const Input = styled.input`
    flex: 1;
    outline: none;
    border: 1px solid #868e96;
    font-size: 1.25rem;
    height: 1.85rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
`;

const Title = styled.h1``;

type Props = {
    type: string;
    hideModal({ name }: ModalVisiblePayload): any;
    showModal({ name }: ModalVisiblePayload): any;
    onRegister?: any;
    onChange({ name, value }: NameValueType): any;
    initializeInput(): any;
    username: string;
    password: string;
    loading?: boolean;
};

const AuthModal = ({
    type,
    hideModal,
    showModal,
    onChange,
    initializeInput,
    username,
    password,
    onRegister,
    loading,
}: Props) => {
    return (
        <AuthForm>
            <Title>{type === 'login' ? 'LOGIN' : 'REGISTER'}</Title>
            <LabelWithInput>
                <Label>Username</Label>
                <InputWrapper>
                    <Input
                        name="username"
                        value={username}
                        onChange={e => {
                            const { name, value } = e.target;
                            onChange({ name, value });
                        }}
                    />
                </InputWrapper>
            </LabelWithInput>
            <LabelWithInput>
                <Label>Password</Label>
                <InputWrapper>
                    <Input
                        name="password"
                        value={password}
                        type="password"
                        onChange={e => {
                            const { name, value } = e.target;
                            onChange({ name, value });
                        }}
                    />
                </InputWrapper>
            </LabelWithInput>
            {type === 'login' ? (
                <>
                    <Button
                        style={{
                            color: '#ffffff',
                            background: '#7950f2',
                            marginTop: '1rem',
                            height: '1.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        LOGIN
                    </Button>
                    <Button
                        style={{
                            color: '#ffffff',
                            background: '#7950f2',
                            marginTop: '0.75rem',
                            height: '1.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => {
                            initializeInput();
                            hideModal({ name: 'login' });
                            showModal({ name: 'register' });
                        }}
                    >
                        REGISTER
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        style={{
                            color: '#ffffff',
                            background: '#7950f2',
                            marginTop: '1rem',
                            height: '1.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() =>
                            onRegister({
                                variables: { name: username, password },
                            })
                        }
                    >
                        {loading ? 'LOADING...' : 'REGISTER'}
                    </Button>
                    <Button
                        style={{
                            color: '#ffffff',
                            background: '#7950f2',
                            marginTop: '0.75rem',
                            height: '1.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => {
                            initializeInput();
                            hideModal({ name: 'register' });
                            showModal({ name: 'login' });
                        }}
                    >
                        LOGIN
                    </Button>
                </>
            )}
        </AuthForm>
    );
};

export default AuthModal;

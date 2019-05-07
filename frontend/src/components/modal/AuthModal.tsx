import React from 'react';
import styled from 'styled-components';

const AuthForm = styled.div`
    background: #ffffff;
    height: 350px;
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

const UsernameInput = styled.input`
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
};

const AuthModal = ({ type }: Props) => {
    return (
        <AuthForm>
            <Title>{type === 'login' ? 'LOGIN' : 'REGISTER'}</Title>
            <LabelWithInput>
                <Label>Username</Label>
                <InputWrapper>
                    <UsernameInput />
                </InputWrapper>
            </LabelWithInput>
            <LabelWithInput>
                <Label>Password</Label>
                <InputWrapper>
                    <UsernameInput />
                </InputWrapper>
            </LabelWithInput>
        </AuthForm>
    );
};

export default AuthModal;

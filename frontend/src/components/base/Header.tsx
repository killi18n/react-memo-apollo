import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from 'components/common/Button';
import { actions as modalActions } from 'store/modules/modal';

const HeaderWrapper = styled.div`
    background: #7048e8;
    height: 5rem;
    display: flex;
    align-items: center;
`;

const HeaderTitle = styled.div`
    padding-left: 1.5rem;
    color: white;
    font-size: 1.5rem;
    font-weight: 650;
`;

const HeaderRight = styled.div`
    margin-left: auto;
    margin-right: 1.5rem;
    color: white;
    font-weight: 650;
`;

type Props = {
    ModalActions: typeof modalActions;
    logged: boolean;
    setLogged(isLoggedIn: boolean): void;
};

const Header = ({ ModalActions, logged, setLogged }: Props) => {
    const showLoginModal = () => ModalActions.showModal({ name: 'login' });
    return (
        <HeaderWrapper>
            <HeaderTitle>
                <Link to="/">React Apollo Memo</Link>
            </HeaderTitle>
            <HeaderRight>
                {!logged ? (
                    <Button onClick={showLoginModal}>LOG IN</Button>
                ) : (
                    <Button
                        onClick={() => {
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    localStorage.clear();
                                    setLogged(false);
                                    resolve();
                                }, 3000);
                            });
                        }}
                    >
                        LOG OUT
                    </Button>
                )}
            </HeaderRight>
        </HeaderWrapper>
    );
};

export default Header;

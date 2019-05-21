import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GraphqlData } from '../types/common';
import { authActions } from '../store/modules/auth';

const CHECK_USER_LOGGED_IN = gql`
    query CheckUserLoggedIn($token: String!) {
        checkUserLoggedIn(token: $token) {
            _id
            name
            createdAt
        }
    }
`;

const Base = () => {
    const dispatch = useDispatch();
    const AuthActions = bindActionCreators(authActions, dispatch);
    const userInfo =
        typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
    if (!userInfo) {
        return null;
    } else {
        AuthActions.setLogged(true);
    }
    const token = JSON.parse(userInfo).jwt;
    return (
        <Query query={CHECK_USER_LOGGED_IN} variables={{ token }}>
            {({ loading, error, data }: GraphqlData) => {
                if (loading) {
                }
                if (error) {
                    AuthActions.setLogged(false);
                    typeof window !== 'undefined' && localStorage.clear();
                }
                return null;
            }}
        </Query>
    );
};
export default Base;

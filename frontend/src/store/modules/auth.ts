import { handleActions, createAction } from 'redux-actions';
import produce from 'immer';

const SET_LOGGED = '@auth/SET_LOGGED';
const SET_ERROR = '@auth/SET_ERROR';

export type ErrorType = {
    errorNumber: number;
    description: string;
};

export const authActions = {
    setLogged: createAction(SET_LOGGED),
    setError: createAction(SET_ERROR, (payload: ErrorType) => payload),
};

export type State = {
    logged: boolean;
    error: {
        errorNumber: number;
        description: string;
    };
};

const initialState: State = {
    logged: false,
    error: {
        errorNumber: 0,
        description: '',
    },
};

type SetErrorAction = {
    payload: ErrorType;
};

const reducer = handleActions(
    {
        [SET_LOGGED]: (state: State) => {
            return produce(state, draft => {
                draft.logged = true;
            });
        },
        [SET_ERROR]: (state: State, action: SetErrorAction) => {
            return produce(state, draft => {
                const { errorNumber, description } = action.payload;
                draft.error = {
                    errorNumber,
                    description,
                };
            });
        },
    },
    initialState
);

export default reducer;

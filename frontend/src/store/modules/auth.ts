import { handleActions, createAction } from 'redux-actions';
import produce from 'immer';

const SET_LOGGED = '@auth/SET_LOGGED';
const SET_ERROR = '@auth/SET_ERROR';
const INITIALIZE_ERROR = '@auth/INITIALIZE_ERROR';

export type ErrorType = {
    errorNumber: number;
    description: string;
};

export const authActions = {
    setLogged: createAction(SET_LOGGED, (payload: boolean) => payload),
    setError: createAction(SET_ERROR, (payload: ErrorType) => payload),
    initializeError: createAction(INITIALIZE_ERROR),
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
        [SET_LOGGED]: (state: State, action: any) => {
            return produce(state, draft => {
                const { payload } = action;
                draft.logged = payload;
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
        [INITIALIZE_ERROR]: (state: State) => {
            return produce(state, draft => {
                draft.error = initialState.error;
            });
        },
    },
    initialState
);

export default reducer;

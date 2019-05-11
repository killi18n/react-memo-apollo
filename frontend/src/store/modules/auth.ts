import { handleActions, createAction } from 'redux-actions';
import produce from 'immer';

const SET_LOGGED = '@auth/SET_LOGGED';

export const authActions = {
    setLogged: createAction(SET_LOGGED),
};

export type State = {
    logged: boolean;
};

const initialState: State = {
    logged: false,
};

const reducer = handleActions(
    {
        [SET_LOGGED]: (state: State) => {
            return produce(state, draft => {
                draft.logged = true;
            });
        },
    },
    initialState
);

export default reducer;

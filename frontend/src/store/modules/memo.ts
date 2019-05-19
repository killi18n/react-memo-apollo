import produce from 'immer';
import { handleActions, createAction } from 'redux-actions';

const CHANGE_INPUT = '@memo/CHANGE_INPUT';
const INITIALIZE_INPUT = '@memo/INITIALIZE_INPUT';

export type ChangeInputPayload = {
    name: string;
    value: string;
};

export const actions = {
    changeInput: createAction(
        CHANGE_INPUT,
        (payload: ChangeInputPayload) => payload
    ),
    initializeInput: createAction(INITIALIZE_INPUT),
};

export type State = {
    input: {
        memo: string;
    };
};

const initialState: State = {
    input: {
        memo: '',
    },
};

type ChangeInputAction = {
    payload: ChangeInputPayload;
};

const reducer = handleActions(
    {
        [CHANGE_INPUT]: (state: State, action: ChangeInputAction) => {
            return produce(state, draft => {
                const { name, value } = action.payload;
                (draft.input as any)[name] = value;
            });
        },
        [INITIALIZE_INPUT]: (state: State) => {
            return produce(state, draft => {
                draft.input = initialState.input;
            });
        },
    },
    initialState
);

export default reducer;

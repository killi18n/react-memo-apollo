import { handleActions, createAction } from 'redux-actions';
import produce from 'immer';
import { NameValueType } from 'types/common';

const SHOW_MODAL = '@modal/SHOW_MODAL';
const HIDE_MODAL = '@modal/HIDE_MODAL';
const HIDE_ALL_MODAL = '@modal/HIDE_ALL_MODAL';
const CHANGE_INPUT = '@modal/CHANGE_INPUT';
const INITIALIZE_INPUT = '@modal/INITIALIZE_INPUT';

export type ModalVisiblePayload = {
    name: string;
};

export const actions = {
    showModal: createAction(SHOW_MODAL, ({ name }: ModalVisiblePayload) => ({
        name,
    })),
    hideModal: createAction(HIDE_MODAL, ({ name }: ModalVisiblePayload) => ({
        name,
    })),
    hideAllModal: createAction(HIDE_ALL_MODAL),
    changeInput: createAction(
        CHANGE_INPUT,
        ({ name, value }: NameValueType) => ({ name, value })
    ),
    initializeInput: createAction(INITIALIZE_INPUT),
};

export type State = {
    visible: {
        login: boolean;
        register: boolean;
    };
    input: {
        username: string;
        password: string;
    };
};

const initialState: State = {
    visible: {
        login: false,
        register: false,
    },
    input: {
        username: '',
        password: '',
    },
};

type ModalVisibleAction = {
    payload: ModalVisiblePayload;
};

type NameValueAction = {
    payload: NameValueType;
};

const reducer = handleActions(
    {
        [SHOW_MODAL]: (state: State, action: ModalVisibleAction) => {
            return produce(state, draft => {
                const { name } = action.payload;
                (draft.visible as any)[name] = true;
            });
        },
        [HIDE_MODAL]: (state: State, action: ModalVisibleAction) => {
            return produce(state, draft => {
                const { name } = action.payload;
                (draft.visible as any)[name] = false;
            });
        },
        [HIDE_ALL_MODAL]: (state: State) => {
            return produce(state, draft => {
                draft.visible = initialState.visible;
            });
        },
        [CHANGE_INPUT]: (state: State, action: NameValueAction) => {
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

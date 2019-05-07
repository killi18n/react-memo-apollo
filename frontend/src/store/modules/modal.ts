import { handleActions, createAction } from 'redux-actions';
import produce from 'immer';

const SHOW_MODAL = '@modal/SHOW_MODAL';
const HIDE_MODAL = '@modal/HIDE_MODAL';
const HIDE_ALL_MODAL = '@modal/HIDE_ALL_MODAL';

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
};

export type State = {
    visible: {
        login: boolean;
        register: boolean;
    };
};

const initialState: State = {
    visible: {
        login: false,
        register: false,
    },
};

type ModalVisibleAction = {
    payload: ModalVisiblePayload;
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
                Object.keys(state.visible).forEach(name => {
                    (draft.visible as any)[name] = false;
                });
            });
        },
    },
    initialState
);

export default reducer;

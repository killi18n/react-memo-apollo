import produce from 'immer';
import { handleActions, createAction } from 'redux-actions';
import { Memo } from '../../types/common';

const CHANGE_INPUT = '@memo/CHANGE_INPUT';
const INITIALIZE_INPUT = '@memo/INITIALIZE_INPUT';
const SET_MEMOS = '@memo/SET_MEMOS';
const SET_NEW_MEMO = '@memo/SET_NEW_MEMO';
const SET_PAGE = '@memo/SET_PAGE';
const SET_IS_LAST_PAGE = '@memo/SET_IS_LAST_PAGE';

export type ChangeInputPayload = {
    name: string;
    value: string;
};

export type SetMemosPayload = {
    memos: Memo[];
};

export type SetNewMemoPayload = {
    memo: Memo;
};

export const actions = {
    changeInput: createAction(
        CHANGE_INPUT,
        (payload: ChangeInputPayload) => payload
    ),
    initializeInput: createAction(INITIALIZE_INPUT),
    setMemos: createAction(SET_MEMOS, (payload: SetMemosPayload) => payload),
    setNewMemo: createAction(
        SET_NEW_MEMO,
        (payload: SetNewMemoPayload) => payload
    ),
    setPage: createAction(SET_PAGE, ({ page }: any) => ({ page })),
    setIsLastPage: createAction(SET_IS_LAST_PAGE, ({ isLastPage }: any) => ({
        isLastPage,
    })),
};

export type State = {
    input: {
        memo: string;
    };
    memos: Memo[];
    page: number;
    limit: number;
    isLastPage: boolean;
};

const initialState: State = {
    input: {
        memo: '',
    },
    memos: [],
    page: 1,
    limit: 10,
    isLastPage: false,
};

type ChangeInputAction = {
    payload: ChangeInputPayload;
};

const reducer = handleActions(
    {
        [SET_MEMOS]: (state: State, action: any) => {
            return produce(state, draft => {
                draft.memos = state.memos.concat(action.payload.memos);
            });
        },
        [SET_NEW_MEMO]: (state: State, action: any) => {
            return produce(state, draft => {
                draft.memos = [action.payload.memo].concat(state.memos);
            });
        },
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
        [SET_PAGE]: (state: State, action: any) => {
            return produce(state, draft => {
                draft.page = action.payload.page;
            });
        },
        [SET_IS_LAST_PAGE]: (state: State, action: any) => {
            return produce(state, draft => {
                draft.isLastPage = action.payload.isLastPage;
            });
        },
    },
    initialState
);

export default reducer;

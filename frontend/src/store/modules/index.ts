import modal, { State as ModalState } from './modal';
import auth, { State as AuthState } from './auth';
import memo, { State as MemoState } from './memo';

export type State = {
    modal: ModalState;
    auth: AuthState;
    memo: MemoState;
};

export default {
    modal,
    auth,
    memo,
};

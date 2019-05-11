import modal, { State as ModalState } from './modal';
import auth, { State as AuthState } from './auth';

export type State = {
    modal: ModalState;
    auth: AuthState;
};

export default {
    modal,
    auth,
};

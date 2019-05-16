import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WriteBox from 'components/memo/WriteBox';
import { bindActionCreators } from 'redux';
import { actions as memoActions, ChangeInputPayload } from 'store/modules/memo';
import { State } from 'store/modules';

const WriteContainer = () => {
    const dispatch = useDispatch();

    const MemoActions = bindActionCreators(memoActions, dispatch);
    const changeInput = (payload: ChangeInputPayload) =>
        MemoActions.changeInput(payload);

    const memoInput = useSelector(({ memo }: State) => memo.input.memo);

    return <WriteBox handleChange={changeInput} memoInput={memoInput} />;
};

export default WriteContainer;

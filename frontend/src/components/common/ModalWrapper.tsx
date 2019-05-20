import React, { Component } from 'react';
import styled from 'styled-components';
import { Children } from '../../types/common';

type Props = {
    visible: boolean;
    children: Children;
    onClick(): any;
};

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

class ModalWrapper extends Component<Props> {
    private modalWrapperRef = React.createRef<HTMLDivElement>();
    private innerModalRef = React.createRef<HTMLDivElement>();

    handleClickOverlay = (e: any) => {
        const { onClick } = this.props;
        if (this.modalWrapperRef.current) {
            if (e.target.contains(this.innerModalRef.current)) {
                onClick();
            }
        }
    };

    render() {
        const { children } = this.props;
        const { handleClickOverlay } = this;
        return (
            <Wrapper ref={this.modalWrapperRef} onClick={handleClickOverlay}>
                <div ref={this.innerModalRef}>{children}</div>
            </Wrapper>
        );
    }
}

export default ModalWrapper;

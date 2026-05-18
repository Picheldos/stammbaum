import React from 'react';
import { Container } from './TransitionLayer.styled';

interface TransitionLayerProps {
    visible?: boolean;
}

const TransitionLayer: React.FC<TransitionLayerProps> = ({ visible = false }) => {
    return <Container visible={visible} />;
};

export default TransitionLayer;

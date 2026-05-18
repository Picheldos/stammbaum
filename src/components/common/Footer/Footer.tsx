import React from 'react';
import { Container } from './Footer.styled';

const Footer: React.FC = () => {
    return <Container>© {new Date().getFullYear()} Stammbaum</Container>;
};

export default Footer;

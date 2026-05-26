import React from 'react';
import { Container, Title, Subtitle } from './AboutBlock.styled';


export interface AboutBlockProps {
  title: string;
  subtitle?: string;
  color?: string;
}

export const AboutBlock: React.FC<AboutBlockProps> = ({ title, subtitle, color }) => {
  return (
    <Container>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Container>
  );
};  
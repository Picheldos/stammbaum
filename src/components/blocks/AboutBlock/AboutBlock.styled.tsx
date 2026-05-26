import styled from 'styled-components';
import { mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.div<{ variant?: string; color?: string }>`
  top: ${vw(132, 'xs')};
  left: ${vw(20, 'xs')};
  width: ${vw(283, 'xs')};
  height: ${vw(260, 'xs')};
  border-radius: ${vw(5, 'xs')};
  opacity: 1;
  transform: rotate(${vw(0, 'xs')}deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${vw(24, 'xs')};
  text-align: center;

  ${mediaBreakpointUp('lg')} {
    top: ${vw(132, 'md')};
    left: ${vw(20, 'md')};
    width: ${vw(283, 'xl')};
    height: ${vw(260, 'xl')};
    padding: ${vw(24, 'xl')};
  }

  ${({ variant }) =>
    variant === 'image' &&
    `
      padding: 0;
      overflow: hidden;
    `}
`;

export const Title = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

export const PlusButton = styled.button`
  margin-top: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  color: white;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
import styled, { css } from 'styled-components';
import { mediaBreakpointUp, vw, font, color } from '@/style/mixins';

const plusButtonHoverStyles = css`
  background: ${color('white', 0.1)};
`;

export const PlusButton = styled.button`
  margin-top: auto;
  margin-left: auto;

  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid white;
  background: transparent;
  color: white;
  font-size: 2.1rem;
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    ${plusButtonHoverStyles}
  }

  ${mediaBreakpointUp('lg')} {
    width: ${vw(61)};
    height: ${vw(61)};
  }
`;

export const Container = styled.div<{ variant?: string; color?: string }>`
  border-radius: 5px;
  opacity: 1;
  transform: rotate(${vw(0, 'xs')}deg);
  display: flex;
  flex-direction: column;

  margin-bottom: 10px;

  padding: ${vw(24, 'xs')};

  ${mediaBreakpointUp('lg')} {
    width: ${vw(283, 'xl')};
    height: ${vw(260, 'xl')};
    padding: ${vw(30)};
  }

  ${({ variant }) =>
    variant === 'image' &&
    `
      padding: 0!important;
      overflow: hidden!important;
    `}

  ${({ variant }) =>
    variant === 'step' &&
    css`
      cursor: pointer;

      &:hover ${PlusButton} {
        ${plusButtonHoverStyles}
      }
    `}

  ${({ variant }) =>
    variant === 'text' &&
    css`
      width: auto;
      height: auto;
      border: 1px solid ${color('ink', 0.5)};
    `}

  ${({ color }) =>
    color &&
    `
      color: white;
      background: ${color};
    `}
`;

export const Title = styled.div<{ $variant?: string }>`
  ${font('font5')};

  ${({ $variant }) =>
    $variant !== 'text' &&
    css`
      max-width: 135px;

      ${mediaBreakpointUp('lg')} {
        max-width: ${vw(240)};
      }
    `}
`;

export const StepNumber = styled.h2`
  ${font('title2')};
  margin-bottom: ${vw(10, 'xs')};

  ${mediaBreakpointUp('lg')} {
    margin-bottom: ${vw(30)};
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
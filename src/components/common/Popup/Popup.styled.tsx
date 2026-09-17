import styled from 'styled-components';
import { color, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${color('black', 0.6)};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const Content = styled.div<{ className?: string }>`

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  position: relative;
  border-radius: ${vw(10.24, 'xs')};
  padding: ${vw(27.307, 'xs')};
  max-width: 90%;
  width: ${vw(426.667, 'xs')};
  box-shadow: 0 ${vw(8.533, 'xs')} ${vw(34.133, 'xs')} ${color('black', 0.3)};
  animation: slideUp 0.3s ease;

  background: ${color('popupBackground')};

  @keyframes slideUp {
    from { transform: translateY(${vw(17.067, 'xs')}); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  ${mediaBreakpointUp('md')} {
    border-radius: ${vw(12, 'md')};
    padding: ${vw(40, 'md')};
    width: ${vw(600, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    border-radius: ${vw(12)};
    padding: ${vw(100)} ${vw(90)};
    width: ${vw(700)};
    height: ${vw(450)};
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h2`
  ${font('sectionTitle')};

  color: ${color('textPrimary')};
`;

const iconLineStyles = `
  position: absolute;
  display: block;
  width: 2px;
  height: ${vw(13, 'xs')};
  background: ${color('textPrimary')};
  border-radius: 1px;
`;

export const IconButton = styled.button`
  position: absolute;
  width: ${vw(16, 'xs')};
  height: ${vw(16, 'xs')};
  min-width: ${vw(16, 'xs')};
  min-height: ${vw(16, 'xs')};
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  flex-shrink: 0;

  span {
    ${iconLineStyles}
  }

  &:hover span {
    opacity: 0.7;
  }
`;

export const CloseButton = styled(IconButton)`
  top: ${vw(30, 'xs')};
  right: ${vw(30, 'xs')};

  span {
    left: 50%;
    top: 50%;
    margin-left: -1px;
    margin-top: -5px;
    transform-origin: center center;
  }

  span:first-child {
    transform: rotate(45deg);
  }

  span:last-child {
    transform: rotate(-45deg);
  }
`;

export const PrevButton = styled(IconButton)`
  left: ${vw(30, 'xs')};
  top: 50%;
  transform: translateY(-50%);

  span:first-child {
    left: 2px;
    bottom: 50%;
    transform-origin: left bottom;
    transform: rotate(45deg);
  }

  span:last-child {
    left: 2px;
    top: 50%;
    transform-origin: left top;
    transform: rotate(-45deg);
  }
`;

export const NextButton = styled(IconButton)`
  right: ${vw(30, 'xs')};
  top: 50%;
  transform: translateY(-50%);

  span:first-child {
    right: 2px;
    bottom: 50%;
    transform-origin: right bottom;
    transform: rotate(-45deg);
  }

  span:last-child {
    right: 2px;
    top: 50%;
    transform-origin: right top;
    transform: rotate(45deg);
  }
`;

export const Body = styled.div`
  color: ${color('textPrimary')};
  /* margin-bottom: ${vw(27.307, 'xs')};

  // ${mediaBreakpointUp('md')} {
  //   margin-bottom: ${vw(40, 'md')};
  // } */
`;

export const Subtitle = styled.div`
    ${font('step')};
`;

export const Text = styled.div`
    ${font('cardTitle')};
`;

export const Footer = styled.div<{ className?: string }>`
  display: flex;
  justify-content: flex-end;
  gap: ${vw(10.24, 'xs')};

  ${mediaBreakpointUp('md')} {
    gap: ${vw(16, 'md')};
  }
`;

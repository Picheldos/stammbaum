import styled from 'styled-components';
import { color, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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
  position: relative;
  border-radius: ${vw(12, 'xs')};
  padding: ${vw(32, 'xs')};
  max-width: 90%;
  width: ${vw(500, 'xs')};
  box-shadow: 0 ${vw(10, 'xs')} ${vw(40, 'xs')} rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from { transform: translateY(${vw(20, 'xs')}); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  ${mediaBreakpointUp('md')} {
    border-radius: ${vw(12, 'md')};
    padding: ${vw(40, 'md')};
    width: ${vw(600, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    border-radius: ${vw(12, 'lg')};
    padding: ${vw(48, 'lg')};
    width: ${vw(700, 'lg')};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${vw(24, 'xs')};

  ${mediaBreakpointUp('md')} {
    margin-bottom: ${vw(32, 'md')};
  }
`;

export const Title = styled.h2`
  ${font('font1')};
  color: ${color('textPrimary')};
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${vw(8, 'xs')};
  transition: color 0.2s ease;

  &:hover {
    color: ${color('textPrimary')};
  }

  ${mediaBreakpointUp('md')} {
    padding: ${vw(10, 'md')};
  }
`;

export const Body = styled.div`
  ${font('font5')};
  color: ${color('textPrimary')};
  line-height: ${vw(24, 'xs')};
  margin-bottom: ${vw(32, 'xs')};

  ${mediaBreakpointUp('md')} {
    line-height: ${vw(28, 'md')};
    margin-bottom: ${vw(40, 'md')};
  }
`;

export const Footer = styled.div<{ className?: string }>`
  display: flex;
  justify-content: flex-end;
  gap: ${vw(12, 'xs')};

  ${mediaBreakpointUp('md')} {
    gap: ${vw(16, 'md')};
  }
`;
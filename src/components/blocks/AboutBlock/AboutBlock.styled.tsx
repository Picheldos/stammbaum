import styled from 'styled-components';
import { color, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const Container = styled.div<{ colorBg?: string }>`
  position: absolute;
  top: ${vw(132, 'xs')};
  left: ${vw(20, 'xs')};
  width: ${vw(283, 'xs')};
  height: ${vw(260, 'xs')};
  border-radius: ${vw(5, 'xs')};
  background: ${colorBg => color(`${colorBg}`)};
  opacity: 1;
  transform: rotate(${vw(0, 'xs')}deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${vw(24, 'xs')};

  ${mediaBreakpointUp('md')} {
    top: ${vw(132, 'md')};
    left: ${vw(20, 'md')};
    width: ${vw(283, 'md')};
    height: ${vw(260, 'md')};
    border-radius: ${vw(5, 'md')};
    padding: ${vw(24, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    top: ${vw(132, 'lg')};
    left: ${vw(20, 'lg')};
    width: ${vw(283, 'lg')};
    height: ${vw(260, 'lg')};
    border-radius: ${vw(5, 'lg')};
    padding: ${vw(24, 'lg')};
  }
`;

export const Title = styled.h3`
  ${font('font2')};
  margin-bottom: ${vw(12, 'xs')};
  color: ${color('textPrimary')};

  ${mediaBreakpointUp('md')} {
    margin-bottom: ${vw(12, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    margin-bottom: ${vw(12, 'lg')};
  }
`;

export const Subtitle = styled.p`
  ${font('font6')};
  color: ${color('textSecondary')};
  text-align: center;
  line-height: ${vw(20, 'xs')};

  ${mediaBreakpointUp('md')} {
    line-height: ${vw(22, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    line-height: ${vw(24, 'lg')};
  }
`;
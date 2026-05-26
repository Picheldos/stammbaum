import styled from 'styled-components';
import { color, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const Container = styled.section<{ className?: string }>`
  position: relative;
  padding: ${vw(80, 'xs')} 0;
  background: ${color('aboutSectionBg')};
  color: ${color('textPrimary')};

  ${mediaBreakpointUp('md')} {
    padding: ${vw(100, 'md')} 0;
  }

  ${mediaBreakpointUp('lg')} {
    padding: ${vw(120, 'lg')} 0;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${vw(40, 'xs')};

  ${mediaBreakpointUp('md')} {
    flex-direction: row;
    align-items: flex-start;
    gap: ${vw(60, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    gap: ${vw(80, 'lg')};
  }
`;

export const TextContainer = styled.div`
  flex: 1;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${vw(24, 'xs')};

  ${mediaBreakpointUp('md')} {
    flex: 0 0 ${vw(500, 'md')};
  }
`;

export const Title = styled.h2`
  ${font('font1')};
  margin-bottom: ${vw(16, 'xs')};

  ${mediaBreakpointUp('md')} {
    margin-bottom: ${vw(24, 'md')};
  }
`;

export const Description = styled.p`
  ${font('font5')};
  line-height: ${vw(24, 'xs')};
  color: ${color('textSecondary')};

  ${mediaBreakpointUp('md')} {
    line-height: ${vw(28, 'md')};
  }
`;

export const ImageContainer = styled.div<{ className?: string }>`
  flex: 1;
  width: 100%;
  max-width: ${vw(400, 'xs')};
  aspect-ratio: 1;
  border-radius: ${vw(12, 'xs')};
  overflow: hidden;
  box-shadow: 0 ${vw(6, 'xs')} ${vw(18, 'xs')} rgba(0, 0, 0, 0.12);

  ${mediaBreakpointUp('md')} {
    flex: 0 0 ${vw(500, 'md')};
    max-width: ${vw(500, 'md')};
    border-radius: ${vw(12, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    flex: 0 0 ${vw(600, 'lg')};
    max-width: ${vw(600, 'lg')};
    border-radius: ${vw(12, 'lg')};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    ${mediaBreakpointUp('md')} {
      border-radius: ${vw(12, 'md')};
    }
    ${mediaBreakpointUp('lg')} {
      border-radius: ${vw(12, 'lg')};
    }
  }
`;
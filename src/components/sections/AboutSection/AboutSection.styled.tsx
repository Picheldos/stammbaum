import styled from 'styled-components';
import { font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.section`

  margin-top: ${vw(100, 'xs')};

  h1 {
    ${font('landingHeading')};
    margin-bottom: ${vw(25.6, 'xs')};

    ${mediaBreakpointUp('md')} {
      padding-top: ${vw(40)};
      margin-bottom: ${vw(40)};
    }
  }

  ${mediaBreakpointUp('lg')} {
    margin-top: ${vw(140)};

  }
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;

  ${mediaBreakpointUp('lg')} {
    flex-direction: row;
    flex-wrap: wrap;

  }
`;
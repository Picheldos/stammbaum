import styled from 'styled-components';
import { font, mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.section`

  h1 {
    ${font('title2')};
    margin-bottom: ${vw(30, 'xs')};

    ${mediaBreakpointUp('md')} {
      padding-top: ${vw(40)};
      margin-bottom: ${vw(40)};
    }
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
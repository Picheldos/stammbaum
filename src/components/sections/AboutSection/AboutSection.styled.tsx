import styled from 'styled-components';
import { mediaBreakpointUp, vw } from '@/style/mixins';

export const Container = styled.section`

  h1 {
    text-align: center;
    margin-bottom: ${vw(60, 'xs')};

    ${mediaBreakpointUp('md')} {
      margin-bottom: ${vw(80, 'md')};
    }
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;

  ${mediaBreakpointUp('md')} {
    flex-direction: row;
    flex-wrap: wrap;

  }
`;
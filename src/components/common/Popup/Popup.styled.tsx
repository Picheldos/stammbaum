import styled from 'styled-components';
import { color, mediaBreakpointUp, vw } from '@/style/mixins';
import { xlFontSize, xlOnly } from '@/style/typography';

/* ----------------------------------------------------------------
 * About popup (макет docs/figma-group-103-104.md, Group 20):
 * карточка 700x450, фон #F8EACF, радиус 5px, тень 2/2/4 black@0.25.
 * Типографика: Manrope 500 50/68.3 (шаг), 500 30/30 (подзаголовок),
 * 400 22/24.2 (текст). Мобильного попапа в Group 104 нет, поэтому
 * ниже — пропорционально уменьшенная версия того же дизайна.
 * ---------------------------------------------------------------- */

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(232, 232, 232, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const Content = styled.div<{ className?: string }>`
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;

  /* Мобильного попапа в Group 104 нет — пропорции Group 20 (700x450,
     отступы 90/99/30/100, зазоры 40/30) масштабированы под xs/md. */
  width: ${vw(300, 'xs')};
  padding: ${vw(24, 'xs')} ${vw(16, 'xs')};
  border-radius: 5px;
  box-shadow: 2px 2px 4px ${color('black', 0.25)};
  animation: slideUp 0.3s ease-in-out;
  background: ${color('popupBackground')};

  @keyframes slideUp {
    from { transform: translateY(${vw(14, 'xs')}); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  ${mediaBreakpointUp('md')} {
    width: ${vw(560, 'md')};
    padding: ${vw(70, 'md')} ${vw(70, 'md')} ${vw(80, 'md')};
    border-radius: 5px;
    box-shadow: 2px 2px 4px ${color('black', 0.25)};
  }

  ${mediaBreakpointUp('lg')} {
    width: ${vw(700)};
    padding: ${vw(99)} ${vw(30)} ${vw(100)} ${vw(90)};
    border-radius: 5px;
    box-shadow: 2px 2px 4px ${color('black', 0.25)};
    min-height: ${vw(450)};
    overflow: visible;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${vw(40, 'xs')};

  ${mediaBreakpointUp('md')} {
    margin-bottom: ${vw(40, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    margin-bottom: ${vw(40)};
  }
`;

export const Title = styled.h2`
  font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
  font-weight: 500;
  font-size: ${vw(28, 'xs')};
  line-height: 1.366;
  letter-spacing: 0;
  color: ${color('ink')};
  margin: 0;

  ${mediaBreakpointUp('md')} {
    font-size: ${vw(40, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    font-size: ${vw(50)};
    line-height: ${vw(68.3)};
  }
`;

const iconLineStyles = `
  position: absolute;
  display: block;
  width: 2px;
  background: ${color('ink')};
  border-radius: 1px;
`;

export const IconButton = styled.button`
  position: absolute;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 1;

  span {
    ${iconLineStyles}
    transition: opacity 0.3s ease-in-out;
  }

  &:hover span {
    opacity: 0.7;
  }
`;

export const CloseButton = styled(IconButton)`
  width: ${vw(14, 'xs')};
  height: ${vw(14, 'xs')};
  top: ${vw(12, 'xs')};
  right: ${vw(12, 'xs')};

  span {
    left: 50%;
    top: 50%;
    width: 2px;
    height: 100%;
    margin-left: -1px;
    margin-top: -50%;
    transform-origin: center center;
  }

  span:first-child {
    transform: rotate(45deg);
  }

  span:last-child {
    transform: rotate(-45deg);
  }

  ${mediaBreakpointUp('md')} {
    width: ${vw(14, 'md')};
    height: ${vw(14, 'md')};
    top: ${vw(24, 'md')};
    right: ${vw(24, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    width: ${vw(14)};
    height: ${vw(14)};
    top: ${vw(30)};
    right: ${vw(30)};
  }
`;

/* Шевроны навигации: 10x16, как Vector 19/20 в макете.
 * Левая/правая стрелка стоят по бокам карточки на mid-height (y=557
 * при карточке y=340 h=450), со сдвигом 30px наружу от края. */

const NavButtonBase = styled(IconButton)`
  width: ${vw(16, 'xs')};
  height: ${vw(24, 'xs')};
  top: 50%;
  margin-top: ${vw(-12, 'xs')};

  span {
    left: 50%;
    width: 2px;
    height: 54%;
  }

  span:first-child {
    top: 2%;
  }

  span:last-child {
    bottom: 2%;
  }

  ${mediaBreakpointUp('md')} {
    width: ${vw(12, 'md')};
    height: ${vw(18, 'md')};
    margin-top: ${vw(-9, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    width: ${vw(10)};
    height: ${vw(16)};
    margin-top: ${vw(-8)};
  }
`;

export const PrevButton = styled(NavButtonBase)`
  left: ${vw(12, 'xs')};

  span:first-child {
    transform: translateX(-50%) rotate(45deg);
    transform-origin: bottom center;
  }

  span:last-child {
    transform: translateX(-50%) rotate(-45deg);
    transform-origin: top center;
  }

  ${mediaBreakpointUp('md')} {
    left: ${vw(-28, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    left: ${vw(-30)};
  }
`;

export const NextButton = styled(NavButtonBase)`
  right: ${vw(12, 'xs')};

  span:first-child {
    transform: translateX(-50%) rotate(-45deg);
    transform-origin: bottom center;
  }

  span:last-child {
    transform: translateX(-50%) rotate(45deg);
    transform-origin: top center;
  }

  ${mediaBreakpointUp('md')} {
    right: ${vw(-28, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    right: ${vw(-30)};
  }
`;

export const Subtitle = styled.div`
  font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
  font-weight: 500;
  font-size: ${vw(18, 'xs')};
  line-height: 1.2;
  letter-spacing: 0;
  color: ${color('ink')};
  margin: ${vw(12, 'xs')} 0 0;

  ${mediaBreakpointUp('md')} {
    font-size: ${vw(24, 'md')};
    line-height: 1.2;
    margin-top: ${vw(24, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    font-size: ${vw(30)};
    line-height: ${vw(30)};
    margin-top: 0;
  }
  ${xlFontSize(30)};
  ${xlOnly('line-height', '30px')};
`;

export const Text = styled.div`
  font-family: var(--font-manrope), 'Manrope', Arial, sans-serif;
  font-weight: 400;
  font-size: ${vw(14, 'xs')};
  line-height: 1.1;
  letter-spacing: 0;
  color: ${color('ink')};
  margin: 0;

  ${mediaBreakpointUp('md')} {
    font-size: ${vw(18, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    font-size: ${vw(22)};
    line-height: ${vw(24.2)};
  }
  ${xlFontSize(22)};
  ${xlOnly('line-height', '24.2px')};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vw(12, 'xs')};
  margin-top: ${vw(16, 'xs')};

  ${mediaBreakpointUp('md')} {
    gap: ${vw(20, 'md')};
    margin-top: ${vw(20, 'md')};
  }

  ${mediaBreakpointUp('lg')} {
    gap: 0;
    margin-top: ${vw(30)};
  }
`;

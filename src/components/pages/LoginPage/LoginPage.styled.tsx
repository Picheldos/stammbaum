import styled, { css } from 'styled-components';
import { color, mediaBreakpointUp, vw } from '@/style/mixins';

type AuthMode = 'login' | 'register' | 'forgot';
export type AuthContentMode = AuthMode | 'auth';

const authCardHeight = (mode: AuthContentMode): number => {
    if (mode === 'register') return 376;
    if (mode === 'auth') return 260; // verify-email / reset-password
    return 262;
};

const manrope = css`
    font-family: 'Manrope', sans-serif;
`;

export const Page = styled.section`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    min-height: calc(100vh - ${vw(55, 'xs')});
    padding-top: ${vw(35, 'xs')};
    background: ${color('cream')};

    ${mediaBreakpointUp('lg')} {
        min-height: calc(100vh - ${vw(120)});
        padding-top: ${vw(130)};
    }

    ${mediaBreakpointUp('fhd')} {
        min-height: calc(100vh - ${vw(60)});
        padding-top: ${vw(190)};
    }
`;

export const Modal = styled.div<{ $mode: AuthContentMode }>`
    position: relative;
    width: ${vw(300, 'xs')};
    height: ${({ $mode }) => vw(authCardHeight($mode), 'xs')};
    border-radius: ${vw(5, 'xs')};

    && {
        border-radius: ${vw(5, 'xs')};
    }

    &::before {
        position: absolute;
        inset: 0 0 auto;
        z-index: 0;
        height: ${({ $mode }) => vw($mode === 'auth' ? 220 : ($mode === 'register' ? 326 : 212), 'xs')};
        border-radius: ${vw(5, 'xs')};
        background: ${color('popupBackground')};
        box-shadow: ${vw(2, 'xs')} ${vw(2, 'xs')} ${vw(4, 'xs')} ${color('black', 0.25)};
        content: '';
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(500)};
        height: ${({ $mode }) => vw($mode === 'auth' ? 484 : ($mode === 'register' ? 645 : 484))};
        background: ${color('popupBackground')};
        box-shadow: none;

        && {
            border-radius: ${vw(5)};
        }

        &::before {
            content: none;
        }
    }
`;

export const ModalHeader = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: ${vw(35, 'xs')};
    padding: 0 ${vw(20, 'xs')};
    border-radius: ${vw(5, 'xs')} ${vw(5, 'xs')} 0 0;
    background: ${color('forest')};
    color: ${color('white')};

    ${mediaBreakpointUp('lg')} {
        height: ${vw(60)};
        padding: 0 ${vw(30)};
        border-radius: ${vw(5)} ${vw(5)} 0 0;
    }
`;

export const Title = styled.h3`
    margin: 0;
    ${manrope};
    font-size: ${vw(16, 'xs')};
    font-weight: 500;
    line-height: ${vw(21.856, 'xs')};

    ${mediaBreakpointUp('lg')} {
        font-size: ${vw(22)};
        line-height: ${vw(30.052)};
    }
`;

export const Close = styled.button`
    position: relative;
    width: ${vw(12, 'xs')};
    height: ${vw(12, 'xs')};
    padding: 0;
    border: 0;
    background: transparent;
    color: transparent;
    cursor: pointer;

    &::before,
    &::after {
        position: absolute;
        top: ${vw(5.5, 'xs')};
        left: ${vw(-1.5, 'xs')};
        width: ${vw(15, 'xs')};
        height: ${vw(1, 'xs')};
        background: ${color('white')};
        content: '';
    }

    &::before {
        transform: rotate(45deg);
    }

    &::after {
        transform: rotate(-45deg);
    }

    &:focus-visible {
        outline: ${vw(2, 'xs')} solid ${color('white')};
        outline-offset: ${vw(4, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(21)};
        height: ${vw(23)};

        &::before,
        &::after {
            top: ${vw(11)};
            left: ${vw(-2)};
            width: ${vw(25)};
        }
    }
`;

export const ModalBody = styled.div`
    position: relative;
    z-index: 1;
    padding: ${vw(15, 'xs')} ${vw(20, 'xs')} 0;

    ${mediaBreakpointUp('lg')} {
        padding: ${vw(40)} ${vw(30)} ${vw(30)};
    }
`;

export const Tabs = styled.div`
    display: flex;
    align-items: center;
    gap: ${vw(8, 'xs')};
    height: ${vw(20, 'xs')};
    margin-bottom: ${vw(15, 'xs')};

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(15)};
        height: ${vw(30)};
        margin-bottom: ${vw(30)};
    }
`;

export const Tab = styled.button<{ $active?: boolean }>`
    height: ${vw(20, 'xs')};
    padding: 0 ${({ $active }) => ($active ? vw(7, 'xs') : '0')};
    border: 0;
    border-radius: ${vw(3, 'xs')};
    background: ${({ $active }) => ($active ? color('meadowBlue') : 'transparent')};
    color: ${({ $active }) => ($active ? color('white') : color('ink'))};
    cursor: pointer;
    ${manrope};
    font-size: ${vw(12, 'xs')};
    font-weight: 500;
    line-height: ${vw(16.392, 'xs')};
    white-space: nowrap;

    &:focus-visible {
        outline: ${vw(2, 'xs')} solid ${color('meadowBlue')};
        outline-offset: ${vw(2, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        height: ${vw(30)};
        padding: 0 ${({ $active }) => ($active ? vw(12) : '0')};
        border-radius: ${vw(5)};
        font-size: ${vw(16)};
        line-height: ${vw(21.856)};
    }
`;

export const FieldLabel = styled.label`
    position: absolute;
    width: ${vw(1, 'xs')};
    height: ${vw(1, 'xs')};
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
`;

export const Form = styled.form`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: ${vw(40, 'xs')};
    gap: ${vw(10, 'xs')};

    ${mediaBreakpointUp('lg')} {
        grid-auto-rows: ${vw(64)};
        gap: ${vw(10)};
    }
`;

export const Input = styled.input`
    && {
        display: block;
        width: 100%;
        min-width: 0;
        height: 100%;
        padding: 0 ${vw(10, 'xs')};
        border: 0;
        border-radius: ${vw(5, 'xs')};
    }
    outline: 0;
    background: ${color('white')};
    color: ${color('mutedText')};
    ${manrope};
    font-size: ${vw(12, 'xs')};
    font-weight: 500;
    line-height: ${vw(16.392, 'xs')};

    &::placeholder {
        color: ${color('mutedText')};
        opacity: 1;
    }

    &:focus-visible {
        box-shadow: 0 0 0 2px ${color('meadowBlue')};
    }

    ${mediaBreakpointUp('lg')} {
        && {
            height: 100%;
            padding: 0 ${vw(20)};
            border-radius: ${vw(5)};
        }
        font-size: ${vw(16)};
        line-height: ${vw(21.856)};
    }
`;

export const CheckboxRow = styled.label`
    display: flex;
    align-items: flex-start;
    gap: ${vw(10, 'xs')};
    height: ${vw(21, 'xs')};
    margin-top: 0;
    color: ${color('mutedText')};
    ${manrope};
    font-size: ${vw(10, 'xs')};
    font-weight: 400;
    line-height: ${vw(13.66, 'xs')};

    input {
        flex: 0 0 ${vw(20, 'xs')};
        width: ${vw(20, 'xs')};
        height: ${vw(20, 'xs')};
        margin: 0;
        border: ${vw(0.8, 'xs')} solid ${color('mutedText')};
        border-radius: ${vw(1, 'xs')};
        appearance: none;
        background: transparent;
        cursor: pointer;

        &:checked {
            border-color: ${color('meadowBlue')};
            background: ${color('meadowBlue')};
            box-shadow: inset 0 0 0 ${vw(4, 'xs')} ${color('popupBackground')};
        }

        &:focus-visible {
            outline: ${vw(2, 'xs')} solid ${color('meadowBlue')};
            outline-offset: ${vw(2, 'xs')};
        }
    }

    span {
        width: ${vw(187, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        align-items: center;
        gap: ${vw(20)};
        height: ${vw(25)};
        margin-top: ${vw(10)};
        font-size: ${vw(12)};
        line-height: ${vw(16.392)};

        input {
            flex-basis: ${vw(25)};
            width: ${vw(25)};
            height: ${vw(25)};
            border-width: ${vw(0.8)};
            border-radius: ${vw(1)};

            &:checked {
                box-shadow: inset 0 0 0 ${vw(5)} ${color('popupBackground')};
            }

            &:focus-visible {
                outline-width: ${vw(2)};
                outline-offset: ${vw(2)};
            }
        }

        span {
            width: ${vw(288)};
        }
    }
`;

export const Action = styled.button`
    && {
        position: absolute;
        top: ${vw(187, 'xs')};
        left: 0;
        width: ${vw(300, 'xs')};
        height: ${vw(40, 'xs')};
        padding: 0;
        border: 0;
        border-radius: ${vw(3, 'xs')};
    }
    background: ${color('meadowBlue')};
    box-shadow: ${vw(2, 'xs')} ${vw(2, 'xs')} ${vw(4, 'xs')} ${color('black', 0.25)};
    color: ${color('white')};
    cursor: pointer;
    ${manrope};
    font-size: ${vw(14, 'xs')};
    font-weight: 500;
    line-height: ${vw(19.124, 'xs')};

    &:focus-visible {
        outline: ${vw(2, 'xs')} solid ${color('meadowBlue')};
        outline-offset: ${vw(3, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        && {
            position: static;
            width: 100%;
            height: ${vw(64)};
            padding: 0;
            border-radius: ${vw(5)};
        }
        box-shadow: none;
        font-size: ${vw(18)};
        line-height: ${vw(24.588)};
    }
`;

export const AuxiliaryAction = styled.button`
    order: 3;
    align-self: flex-start;
    padding: 0;
    border: 0;
    background: transparent;
    color: ${color('mutedText')};
    cursor: pointer;
    ${manrope};
    font-size: ${vw(10, 'xs')};
    font-weight: 400;
    line-height: ${vw(13.66, 'xs')};

    &:focus-visible {
        outline: ${vw(2, 'xs')} solid ${color('meadowBlue')};
        outline-offset: ${vw(2, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        margin-top: ${vw(10)};
        font-size: ${vw(12)};
        line-height: ${vw(16.392)};
    }
`;

export const Status = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${vw(12, 'xs')};
    color: ${color('ink')};
    ${manrope};
    font-size: ${vw(12, 'xs')};
    line-height: ${vw(16.392, 'xs')};

    ${mediaBreakpointUp('lg')} {
        font-size: ${vw(16)};
        line-height: ${vw(21.856)};
    }
`;

export const Error = styled.div`
    position: absolute;
    right: ${vw(20, 'xs')};
    bottom: ${vw(10, 'xs')};
    left: ${vw(20, 'xs')};
    color: ${color('error')};
    ${manrope};
    font-size: ${vw(10, 'xs')};
    line-height: ${vw(13.66, 'xs')};

    ${mediaBreakpointUp('lg')} {
        right: ${vw(30)};
        bottom: ${vw(8)};
        left: ${vw(30)};
        font-size: ${vw(12)};
        line-height: ${vw(16.392)};
    }
`;

export const LoginForm = styled(Form)`
    grid-template-rows: ${vw(40, 'xs')} ${vw(40, 'xs')} ${vw(13.66, 'xs')};
    height: ${vw(127, 'xs')};

    ${Action} {
        order: 4;
    }

    ${mediaBreakpointUp('lg')} {
        grid-template-rows: ${vw(64)} ${vw(64)} ${vw(16.392)} ${vw(64)};
        height: ${vw(294)};

        ${Action} {
            margin-top: ${vw(56)};
        }
    }
`;

export const RegisterForm = styled(Form)`
    grid-template-rows: repeat(4, ${vw(40, 'xs')}) ${vw(21, 'xs')};
    height: ${vw(236, 'xs')};

    ${Action} {
        top: ${vw(301, 'xs')};
    }

    ${mediaBreakpointUp('lg')} {
        grid-template-rows: repeat(4, ${vw(64)}) ${vw(25)} ${vw(64)};
        height: ${vw(455)};

        ${Action} {
            margin-top: ${vw(60)};
        }
    }
`;

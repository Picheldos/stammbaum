import styled from 'styled-components';
import { color, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const Container = styled.div<{ $hidden?: boolean }>`
    pointer-events: auto;
    position: relative;
    width: ${vw(153.6, 'xs')};
    height: fit-content;
    padding: ${vw(13.653, 'xs')} ${vw(13.653, 'xs')} ${vw(13.653, 'xs')};
    padding-top: ${vw(47.787, 'xs')};
    margin-top: 0;
    border-radius: ${vw(10.24, 'xs')};
    background: ${color('landingCard')};
    box-shadow: 0 ${vw(5.12, 'xs')} ${vw(15.36, 'xs')} ${color('forestDeep', 0.12)};
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${vw(5.12, 'xs')};
    color: ${color('textPrimary')};
    border: 1px solid ${color('ink', 0.75)};
    opacity: ${({ $hidden }) => ($hidden ? 0.45 : 1)};
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    z-index: 2;
    cursor: default;

    ${font('personName')};

    ${mediaBreakpointUp('md')} {
        width: ${vw(180, 'md')};
        padding: ${vw(16, 'md')} ${vw(16, 'md')} ${vw(16, 'md')};
        padding-top: ${vw(56, 'md')};
        margin-top: 0;
        border-radius: ${vw(12, 'md')};
        box-shadow: 0 ${vw(6, 'md')} ${vw(18, 'md')} ${color('forestDeep', 0.12)};
        gap: ${vw(6, 'md')};
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(105)};
        height: ${vw(50)};
        padding: ${vw(12)};
        margin-top: 0;
        border-radius: ${vw(10)};
        box-shadow: 0 ${vw(6)} ${vw(18)} ${color('forestDeep', 0.12)};
        gap: 5px;
    }

    @media (min-width: 1440px) {
        width: ${vw(105)};
        height: ${vw(66)};
        padding: ${vw(10)};
    }
`;

export const AvatarStub = styled.div<{ $photo?: string }>`
    width: ${vw(59.733, 'xs')};
    height: ${vw(59.733, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: ${vw(3.413, 'xs')} solid ${color('white', 0.75)};
    box-shadow: 0 ${vw(1.707, 'xs')} ${vw(5.12, 'xs')} ${color('black', 0.18)}, inset 0 ${vw(0.853, 'xs')} ${vw(2.56, 'xs')} ${color('black', 0.08)};
    position: absolute;
    top: ${vw(-29.867, 'xs')};
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;

    &::after {
        content: '';
        position: absolute;
        inset: ${vw(11.947, 'xs')} ${vw(13.653, 'xs')};
        border-radius: 50% 50% 40% 40%;
        background: ${color('white', 0.22)};
    }

    ${mediaBreakpointUp('md')} {
        width: ${vw(70, 'md')};
        height: ${vw(70, 'md')};
        border: ${vw(4, 'md')} solid ${color('white', 0.75)};
        box-shadow: 0 ${vw(2, 'md')} ${vw(6, 'md')} ${color('black', 0.18)}, inset 0 ${vw(1, 'md')} ${vw(3, 'md')} ${color('black', 0.08)};
        top: ${vw(-35, 'md')};

        &::after {
            inset: ${vw(14, 'md')} ${vw(16, 'md')};
        }
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(25)};
        height: ${vw(25)};
        border: 1px solid ${color('ink', 0.75)};
        top: ${vw(-12.5)};
        left: auto;
        transform: none;
        z-index: auto;

        &::after {
            inset: ${vw(10)} ${vw(12)};
        }
    }
`;

export const MetaLine = styled.span`
    ${font('personMeta')};
    opacity: 0.78;
`;

export const LifespanLine = styled.span`
    ${font('personMeta')};
    opacity: 0.72;
`;

import styled from 'styled-components';
import { color, mediaBreakpointUp, font, vw } from '@/style/mixins';

export const Container = styled.div<{ $hidden?: boolean }>`
    pointer-events: auto;
    position: relative;
    width: vw(180, 'xs');
    height: fit-content;
    padding: ${vw(16, 'xs')} ${vw(16, 'xs')} ${vw(16, 'xs')};
    padding-top: ${vw(56, 'xs')};
    margin-top: 0;
    border-radius: ${vw(12, 'xs')};
    background: ${color('landingCard')};
    box-shadow: 0 ${vw(6, 'xs')} ${vw(18, 'xs')} rgba(47, 79, 58, 0.12);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: ${vw(6, 'xs')};
    color: ${color('textPrimary')};
    border: 1px solid rgba(48, 48, 42, 0.75);
    opacity: ${({ $hidden }) => ($hidden ? 0.45 : 1)};
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    z-index: 2;
    cursor: default;

    ${font('font8')};

    ${mediaBreakpointUp('md')} {
        width: vw(180, 'md');
        padding: ${vw(16, 'md')} ${vw(16, 'md')} ${vw(16, 'md')};
        padding-top: ${vw(56, 'md')};
        margin-top: 0;
        border-radius: ${vw(12, 'md')};
        box-shadow: 0 ${vw(6, 'md')} ${vw(18, 'md')} rgba(47, 79, 58, 0.12);
        gap: ${vw(6, 'md')};
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(105, 'xl')};
        height: ${vw(50, 'xl')};
        padding: ${vw(12, 'xl')};
        margin-top: 0;
        border-radius: 10px;
        box-shadow: 0 6px 18px rgba(47, 79, 58, 0.12);
        gap: 5px;
    }
`;

export const AvatarStub = styled.div<{ $photo?: string }>`
    width: ${vw(70, 'xs')};
    height: ${vw(70, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: ${vw(4, 'xs')} solid rgba(255, 255, 255, 0.75);
    box-shadow: 0 ${vw(2, 'xs')} ${vw(6, 'xs')} rgba(0, 0, 0, 0.18), inset 0 ${vw(1, 'xs')} ${vw(3, 'xs')} rgba(0, 0, 0, 0.08);
    position: absolute;
    top: ${vw(-35, 'xs')};
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;

    &::after {
        content: '';
        position: absolute;
        inset: ${vw(14, 'xs')} ${vw(16, 'xs')};
        border-radius: 50% 50% 40% 40%;
        background: rgba(255, 255, 255, 0.22);
    }

    ${mediaBreakpointUp('md')} {
        width: ${vw(70, 'md')};
        height: ${vw(70, 'md')};
        border: ${vw(4, 'md')} solid rgba(255, 255, 255, 0.75);
        box-shadow: 0 ${vw(2, 'md')} ${vw(6, 'md')} rgba(0, 0, 0, 0.18), inset 0 ${vw(1, 'md')} ${vw(3, 'md')} rgba(0, 0, 0, 0.08);
        top: ${vw(-35, 'md')};

        &::after {
            inset: ${vw(14, 'md')} ${vw(16, 'md')};
        }
    }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(25, 'xl')};
        height: ${vw(25, 'xl')};
        border: 1px solid rgba(48, 48, 42, 0.75);
        top: ${vw(-12.5, 'xl')};
        left: auto;
        transform: none;
        z-index: auto;

        &::after {
            inset: 10px 12px;
        }
    }
`;

export const MetaLine = styled.span`
    ${font('font9')};
    font-weight: 500;
    opacity: 0.78;
    line-height: 1.2;
`;

export const LifespanLine = styled.span`
    font-size: 5px!important;
    opacity: 0.72;
    line-height: 1.25;
`;
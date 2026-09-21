import styled, { css } from 'styled-components';
import { color, font, mediaBreakpointUp, vw } from '@/style/mixins';
import { ModalCard, ModalVariant } from './Modal.styled';

export const Hero = styled.div`
    display: flex;
    align-items: center;
    gap: ${vw(14, 'xs')};
    margin-bottom: 4px;

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(14)};
    }
`;

export const Avatar = styled.div<{ $photo?: string }>`
    flex: 0 0 auto;
    width: ${vw(64, 'xs')};
    height: ${vw(64, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: 2px solid ${color('white')};

    ${mediaBreakpointUp('lg')} {
        width: ${vw(64)};
        height: ${vw(64)};
    }
`;

export const HeroName = styled.div`
    ${font('mobileHeader')};
    color: ${color('ink')};
`;

export const HeroMeta = styled.div`
    ${font('mobileControl')};
    color: ${color('mutedText')};
`;

export const ListRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${vw(6, 'xs')};
    background: ${color('ink', 0.06)};
    border-radius: ${vw(6, 'xs')};
    padding: 4px ${vw(6, 'xs')} 4px 0;
    &:hover { background: ${color('ink', 0.1)}; }

    ${mediaBreakpointUp('lg')} {
        gap: ${vw(6)};
        border-radius: ${vw(6)};
        padding: 4px ${vw(6)} 4px 0;
    }
`;

export const ListItem = styled.button`
    flex: 1;
    background: transparent;
    border: none;
    border-radius: ${vw(6, 'xs')};
    padding: ${vw(6, 'xs')} ${vw(6, 'xs')} ${vw(6, 'xs')} ${vw(12, 'xs')};
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${vw(12, 'xs')};
    color: ${color('ink')};
    ${font('mobileHeader')};

    ${mediaBreakpointUp('lg')} {
        border-radius: ${vw(6)};
        padding: ${vw(6)} ${vw(6)} ${vw(6)} ${vw(12)};
        gap: ${vw(12)};
    }
`;

export const RemoveRelationButton = styled.button`
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid ${color('mutedText', 0.4)};
    color: ${color('mutedText')};
    border-radius: 50%;
    width: ${vw(24, 'xs')};
    height: ${vw(24, 'xs')};
    padding: 0;
    ${font('mobileHeader')};
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    opacity: 0.7;
    &:hover { opacity: 1; background: ${color('ink', 0.08)}; }

    ${mediaBreakpointUp('lg')} {
        width: ${vw(24)};
        height: ${vw(24)};
    }
`;

export const ListAvatar = styled.div<{ $photo?: string }>`
    flex: 0 0 auto;
    width: ${vw(32, 'xs')};
    height: ${vw(32, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;

    ${mediaBreakpointUp('lg')} {
        width: ${vw(32)};
        height: ${vw(32)};
    }
`;

export const Empty = styled.div`
    ${font('mobileControl')};
    color: ${color('mutedText')};
    opacity: 0.8;
`;

export const ActionRow = styled.div`
    margin-top: ${vw(12, 'xs')};
    display: flex;
    gap: ${vw(8, 'xs')};

    ${mediaBreakpointUp('lg')} {
        margin-top: ${vw(12)};
        gap: ${vw(8)};
    }
`;

export const ActionButton = styled.button`
    background: ${color('landingCta')};
    color: ${color('cream')};
    border: none;
    border-radius: ${vw(8, 'xs')};
    padding: ${vw(10, 'xs')} ${vw(14, 'xs')};
    cursor: pointer;
    ${font('mobileAction')};

    ${mediaBreakpointUp('lg')} {
        border-radius: ${vw(8)};
        padding: ${vw(10)} ${vw(14)};
    }
`;

/**
 * Person-card shell. Inherits the shared cream/cemetery theming from ModalCard
 * (header, tabs, info labels/values) and additionally re-themes this modal's
 * own hero / relation-list text for the dark cemetery variant. Declared after
 * its target components; the cemetery block is a render-time function so their
 * later declaration order is fine.
 */
export const PersonModalCard = styled(ModalCard)<{ $variant?: ModalVariant }>`
    ${({ $variant }) =>
        $variant === 'cemetery' &&
        css`
            ${HeroName},
            ${ListItem},
            ${Empty},
            ${HeroMeta} {
                color: ${color('cream')};
            }
            ${ListRow} {
                background: ${color('cream', 0.18)};
                &:hover {
                    background: ${color('cream', 0.32)};
                }
            }
            ${RemoveRelationButton} {
                border-color: ${color('slateShadow', 0.4)};
                color: ${color('cream')};
                &:hover {
                    background: ${color('slateShadow', 0.15)};
                }
            }
        `}
`;

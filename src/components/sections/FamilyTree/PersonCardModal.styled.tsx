import styled from 'styled-components';
import { color, font, vw } from '@/style/mixins';

export const Hero = styled.div`
    display: flex;
    align-items: center;
    gap: ${vw(14, 'xs')};
    margin-bottom: 4px;
`;

export const Avatar = styled.div<{ $photo?: string }>`
    width: ${vw(64, 'xs')};
    height: ${vw(64, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: 2px solid ${color('white')};
`;

export const HeroName = styled.div`
    ${font('mobileHeader')};
    color: ${color('textPrimary')};
`;

export const HeroMeta = styled.div`
    ${font('mobileControl')};
    color: ${color('textPrimary')};
    opacity: 0.75;
`;

export const ListRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${vw(6, 'xs')};
    background: ${color('white', 0.5)};
    border-radius: ${vw(6, 'xs')};
    padding: 4px ${vw(6, 'xs')} 4px 0;
    &:hover { background: ${color('white')}; }
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
    color: ${color('textPrimary')};
    ${font('mobileHeader')};
`;

export const RemoveRelationButton = styled.button`
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid ${color('slateShadow', 0.4)};
    color: ${color('textPrimary')};
    border-radius: 50%;
    width: ${vw(24, 'xs')};
    height: ${vw(24, 'xs')};
    padding: 0;
    ${font('mobileHeader')};
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    opacity: 0.7;
    &:hover { opacity: 1; background: ${color('slateShadow', 0.15)}; }
`;

export const ListAvatar = styled.div<{ $photo?: string }>`
    width: ${vw(32, 'xs')};
    height: ${vw(32, 'xs')};
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
`;

export const Empty = styled.div`
    ${font('mobileControl')};
    color: ${color('textPrimary')};
    opacity: 0.6;
`;

export const ActionRow = styled.div`
    margin-top: ${vw(12, 'xs')};
    display: flex;
    gap: ${vw(8, 'xs')};
`;

export const ActionButton = styled.button`
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: ${vw(8, 'xs')};
    padding: ${vw(10, 'xs')} ${vw(14, 'xs')};
    cursor: pointer;
    ${font('mobileAction')};
`;

import styled, { css } from 'styled-components';
import { color, font, hover } from '@/style/mixins';

export const NodeWrapper = styled.button<{ $x: number; $y: number; $width: number; $height: number; $hidden?: boolean }>`
    position: absolute;
    transform: translate(${({ $x }) => $x}px, ${({ $y }) => $y}px);
    width: ${({ $width }) => $width}px;
    height: ${({ $height }) => $height}px;
    padding: 8px 10px 10px;
    background: ${color('landingCard')};
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(47, 79, 58, 0.18);
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 4px 8px;
    align-items: center;
    color: ${color('textPrimary')};
    cursor: pointer;
    text-align: left;
    z-index: 2;
    opacity: ${({ $hidden }) => ($hidden ? 0.45 : 1)};
    transition: transform 0.18s ease, box-shadow 0.18s ease;

    ${hover(css`
        box-shadow: 0 10px 24px rgba(47, 79, 58, 0.26);
    `)}
`;

export const NodeAvatar = styled.div<{ $photo?: string }>`
    grid-row: span 3;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: 2px solid rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
`;

export const NodeRelation = styled.span`
    ${font('font4')};
    font-weight: 600;
    line-height: 1.05;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const NodeName = styled.span`
    ${font('font4')};
    font-size: 12px;
    font-weight: 700;
    line-height: 1.15;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const NodeMeta = styled.span`
    ${font('font4')};
    font-size: 10px;
    opacity: 0.7;
    line-height: 1.1;
`;
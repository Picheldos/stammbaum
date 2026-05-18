import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { color, font } from '@/style/mixins';
import { Person } from '@/lib/family/types';
import { formatShortName } from '@/lib/family/relations';

const MenuRoot = styled.div<{ $x: number; $y: number }>`
    position: fixed;
    top: ${({ $y }) => $y}px;
    left: ${({ $x }) => $x}px;
    width: 240px;
    background: ${color('cream')};
    border-radius: 8px;
    box-shadow: 0 12px 28px rgba(47, 79, 58, 0.22);
    border: 1px solid rgba(74, 112, 67, 0.18);
    overflow: hidden;
    z-index: 800;
`;

const MenuHeader = styled.div`
    background: ${color('forest')};
    color: ${color('white')};
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ${font('font7')};
    font-weight: 600;
`;

const MenuClose = styled.button`
    background: transparent;
    border: none;
    color: ${color('white')};
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
`;

const MenuList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 8px 0;
    background: ${color('landingCard')};
`;

const MenuItem = styled.li`
    padding: 9px 16px;
    cursor: pointer;
    color: ${color('textPrimary')};
    ${font('font7')};

    &:hover {
        background: rgba(74, 112, 67, 0.1);
    }
`;

export interface PersonContextMenuProps {
    person: Person;
    x: number;
    y: number;
    showHiddenRelatives: boolean;
    canDelete: boolean;
    onOpenCard: () => void;
    onEditCard: () => void;
    onAddRelative: () => void;
    onViewRelations: () => void;
    onToggleHidden: () => void;
    onToggleShowHidden: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const PersonContextMenu: React.FC<PersonContextMenuProps> = ({
    person,
    x,
    y,
    showHiddenRelatives,
    canDelete,
    onOpenCard,
    onEditCard,
    onAddRelative,
    onViewRelations,
    onToggleHidden,
    onToggleShowHidden,
    onDelete,
    onClose
}) => {
    const { t } = useTranslation('tree');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onDocClick = (event: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(event.target as Node)) onClose();
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    return (
        <MenuRoot ref={ref} $x={x} $y={y}>
            <MenuHeader>
                <span>{formatShortName(person)}</span>
                <MenuClose type="button" aria-label="close" onClick={onClose}>
                    ×
                </MenuClose>
            </MenuHeader>
            <MenuList>
                <MenuItem onClick={onOpenCard}>{t('menu.openCard')}</MenuItem>
                <MenuItem onClick={onEditCard}>{t('menu.editCard')}</MenuItem>
                <MenuItem onClick={onAddRelative}>{t('menu.addRelative')}</MenuItem>
                <MenuItem onClick={onViewRelations}>{t('menu.viewRelations')}</MenuItem>
                <MenuItem onClick={onToggleHidden}>
                    {person.isHidden ? t('menu.unhideRelative') : t('menu.hideRelative')}
                </MenuItem>
                <MenuItem onClick={onToggleShowHidden}>
                    {showHiddenRelatives ? t('menu.hideHiddenRelatives') : t('menu.showHiddenRelatives')}
                </MenuItem>
                {canDelete && <MenuItem onClick={onDelete}>{t('menu.deleteRelative')}</MenuItem>}
            </MenuList>
        </MenuRoot>
    );
};

export default PersonContextMenu;

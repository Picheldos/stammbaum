import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { Person } from '@/lib/family/types';
import { formatShortName } from '@/lib/family/relations';
import { MenuClose, MenuHeader, MenuItem, MenuList, MenuRoot } from './PersonContextMenu.styled';

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
        <MenuRoot ref={ref} $x={x} $y={y} role="menu" aria-label={t('menu.title', { defaultValue: 'Person actions' })}>
            <MenuHeader>
                <span>{formatShortName(person)}</span>
                <MenuClose type="button" aria-label="close" onClick={onClose}>
                    ×
                </MenuClose>
            </MenuHeader>
            <MenuList>
                <MenuItem type="button" role="menuitem" onClick={onOpenCard}>{t('menu.openCard')}</MenuItem>
                <MenuItem type="button" role="menuitem" onClick={onEditCard}>{t('menu.editCard')}</MenuItem>
                <MenuItem type="button" role="menuitem" onClick={onAddRelative}>{t('menu.addRelative')}</MenuItem>
                <MenuItem $condensed type="button" role="menuitem" onClick={onViewRelations}>{t('menu.viewRelations')}</MenuItem>
                <MenuItem type="button" role="menuitem" onClick={onToggleHidden}>
                    {person.isHidden ? t('menu.unhideRelative') : t('menu.hideRelative')}
                </MenuItem>
                <MenuItem type="button" role="menuitem" onClick={onToggleShowHidden}>
                    {showHiddenRelatives ? t('menu.hideHiddenRelatives') : t('menu.showHiddenRelatives')}
                </MenuItem>
                {canDelete && <MenuItem type="button" role="menuitem" onClick={onDelete}>{t('menu.deleteRelative')}</MenuItem>}
            </MenuList>
        </MenuRoot>
    );
};

export default PersonContextMenu;

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { color, font } from '@/style/mixins';

const Backdrop = styled.div<{ $open: boolean }>`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.18);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.25s ease;
    z-index: 700;
`;

const Panel = styled.aside<{ $open: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: min(360px, 86vw);
    background: ${color('landingCard')};
    box-shadow: -8px 0 28px rgba(47, 79, 58, 0.18);
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    z-index: 710;
`;

const TopBar = styled.div`
    padding: 18px 22px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${color('textPrimary')};
    ${font('font3')};
    font-weight: 600;
`;

const CloseBtn = styled.button`
    background: transparent;
    border: none;
    color: ${color('textPrimary')};
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
`;

const TreeSelect = styled.select`
    background: transparent;
    border: none;
    ${font('font3')};
    font-weight: 700;
    color: ${color('textPrimary')};
    padding: 0;
    cursor: pointer;

    &:focus {
        outline: 2px solid ${color('forest')};
        outline-offset: 2px;
        border-radius: 4px;
    }
`;

const Menu = styled.ul`
    list-style: none;
    margin: 0;
    padding: 8px 22px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const MenuItem = styled.li`
    color: ${color('textPrimary')};
    ${font('font7')};
    cursor: pointer;

    &:hover {
        color: ${color('forest')};
    }
`;

export interface TreeSidebarTreeOption {
    id: string;
    name: string;
}

export interface TreeSidebarProps {
    open: boolean;
    trees: TreeSidebarTreeOption[];
    activeTreeId: string;
    onSelectTree: (id: string) => void;
    onClose: () => void;
    onNewTree: () => void;
    onImportantDates: () => void;
    onGallery: () => void;
    onInviteRelatives: () => void;
    onDownloadForPrint: () => void;
    onContactUs: () => void;
}

const TreeSidebar: React.FC<TreeSidebarProps> = ({
    open,
    trees,
    activeTreeId,
    onSelectTree,
    onClose,
    onNewTree,
    onImportantDates,
    onGallery,
    onInviteRelatives,
    onDownloadForPrint,
    onContactUs
}) => {
    const { t } = useTranslation('tree');

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <>
            <Backdrop $open={open} onClick={onClose} aria-hidden={!open} />
            <Panel $open={open} aria-hidden={!open}>
                <TopBar>
                    <TreeSelect
                        value={activeTreeId}
                        onChange={(e) => onSelectTree(e.target.value)}
                        aria-label={t('sidebar.selectTree')}
                    >
                        {trees.map((tree) => (
                            <option key={tree.id} value={tree.id}>
                                {tree.name}
                            </option>
                        ))}
                    </TreeSelect>
                    <CloseBtn type="button" aria-label="close" onClick={onClose}>
                        ×
                    </CloseBtn>
                </TopBar>
                <Menu>
                    <MenuItem onClick={onNewTree}>{t('sidebar.newTree')}</MenuItem>
                    <MenuItem onClick={onImportantDates}>{t('sidebar.importantDates')}</MenuItem>
                    <MenuItem onClick={onGallery}>{t('sidebar.gallery')}</MenuItem>
                    <MenuItem onClick={onInviteRelatives}>{t('sidebar.inviteRelatives')}</MenuItem>
                    <MenuItem onClick={onDownloadForPrint}>{t('sidebar.downloadPrint')}</MenuItem>
                    <MenuItem onClick={onContactUs}>{t('sidebar.contactUs')}</MenuItem>
                </Menu>
            </Panel>
        </>
    );
};

export default TreeSidebar;

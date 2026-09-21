import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
    Backdrop,
    CloseBtn,
    CondensedMenuItem,
    HiddenList,
    HiddenName,
    HiddenRow,
    HiddenSection,
    HiddenTitle,
    Menu,
    MenuItem,
    Panel,
    RestoreButton,
    TopBar,
    TreeSelect
} from './TreeSidebar.styled';

export interface TreeSidebarTreeOption {
    id: string;
    name: string;
}

export interface TreeSidebarHiddenRelative {
    id: string;
    name: string;
}

export interface TreeSidebarProps {
    open: boolean;
    trees: TreeSidebarTreeOption[];
    activeTreeId: string;
    /** Relatives currently hidden from the tree, shown with a restore action. */
    hiddenRelatives: TreeSidebarHiddenRelative[];
    onSelectTree: (id: string) => void;
    onClose: () => void;
    onNewTree: () => void;
    onImportantDates: () => void;
    onGallery: () => void;
    onInviteRelatives: () => void;
    onDownloadForPrint: () => void;
    onContactUs: () => void;
    /** Restore (unhide) a hidden relative back onto the tree. */
    onRestoreRelative: (id: string) => void;
}

const TreeSidebar: React.FC<TreeSidebarProps> = ({
    open,
    trees,
    activeTreeId,
    hiddenRelatives,
    onSelectTree,
    onClose,
    onNewTree,
    onImportantDates,
    onGallery,
    onInviteRelatives,
    onDownloadForPrint,
    onContactUs,
    onRestoreRelative
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
            {open && <Panel $open={open} aria-label={t('sidebar.title', { defaultValue: 'Tree menu' })}>
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
                    <MenuItem type="button" onClick={onNewTree}>{t('sidebar.newTree')}</MenuItem>
                    <MenuItem type="button" onClick={onImportantDates}>{t('sidebar.importantDates')}</MenuItem>
                    <MenuItem type="button" onClick={onGallery}>{t('sidebar.gallery')}</MenuItem>
                    <CondensedMenuItem type="button" onClick={onInviteRelatives}>{t('sidebar.inviteRelatives')}</CondensedMenuItem>
                    <CondensedMenuItem type="button" onClick={onDownloadForPrint}>{t('sidebar.downloadPrint')}</CondensedMenuItem>
                    <CondensedMenuItem type="button" onClick={onContactUs}>{t('sidebar.contactUs')}</CondensedMenuItem>
                </Menu>
                {hiddenRelatives.length > 0 && (
                    <HiddenSection>
                        <HiddenTitle>
                            {t('sidebar.hiddenRelatives', { defaultValue: 'Hidden relatives' })}
                        </HiddenTitle>
                        <HiddenList>
                            {hiddenRelatives.map((relative) => (
                                <HiddenRow key={relative.id}>
                                    <HiddenName title={relative.name}>{relative.name}</HiddenName>
                                    <RestoreButton
                                        type="button"
                                        onClick={() => onRestoreRelative(relative.id)}
                                    >
                                        {t('sidebar.restoreRelative', { defaultValue: 'Restore' })}
                                    </RestoreButton>
                                </HiddenRow>
                            ))}
                        </HiddenList>
                    </HiddenSection>
                )}
            </Panel>}
        </>
    );
};

export default TreeSidebar;

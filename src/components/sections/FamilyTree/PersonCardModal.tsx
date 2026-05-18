import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { color, font } from '@/style/mixins';
import { Person, PersonRelation } from '@/lib/family/types';
import {
    buildLookup,
    formatDate,
    formatFullName,
    getChildren,
    getParents,
    getSiblings,
    getSpouses
} from '@/lib/family/relations';
import {
    HeaderClose,
    InfoBlock,
    InfoLabel,
    InfoValue,
    ModalBody,
    ModalCard,
    ModalHeader,
    Overlay,
    Tab,
    Tabs
} from './Modal.styled';

const Hero = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 4px;
`;

const Avatar = styled.div<{ $photo?: string }>`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
    border: 2px solid ${color('white')};
`;

const HeroName = styled.div`
    ${font('font3')};
    font-weight: 700;
    color: ${color('textPrimary')};
`;

const HeroMeta = styled.div`
    ${font('font4')};
    color: ${color('textPrimary')};
    opacity: 0.75;
`;

const ListRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    padding: 4px 6px 4px 0;

    &:hover {
        background: ${color('white')};
    }
`;

const ListItem = styled.button`
    flex: 1;
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 6px 6px 6px 12px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${color('textPrimary')};
    ${font('font7')};
`;

const RemoveRelationButton = styled.button`
    flex: 0 0 auto;
    background: transparent;
    border: 1px solid rgba(94, 109, 139, 0.4);
    color: ${color('textPrimary')};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 1;
    font-size: 16px;
    cursor: pointer;
    opacity: 0.7;

    &:hover {
        opacity: 1;
        background: rgba(94, 109, 139, 0.15);
    }
`;

const ListAvatar = styled.div<{ $photo?: string }>`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${color('avatarStub')};
    background-image: ${({ $photo }) => ($photo ? `url(${$photo})` : 'none')};
    background-size: cover;
    background-position: center;
`;

const Empty = styled.div`
    ${font('font4')};
    color: ${color('textPrimary')};
    opacity: 0.6;
`;

const ActionRow = styled.div`
    margin-top: 12px;
    display: flex;
    gap: 8px;
`;

const ActionButton = styled.button`
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    ${font('font7')};
    font-weight: 600;
`;

export type PersonCardTab = 'info' | 'parents' | 'spouses' | 'children' | 'siblings';

export type PersonRelationKind = 'parent' | 'spouse' | 'child' | 'sibling';

export interface PersonCardModalProps {
    open: boolean;
    person: Person | null;
    persons: Person[];
    relations: PersonRelation[];
    initialTab?: PersonCardTab;
    onClose: () => void;
    onEdit: (person: Person) => void;
    onSelectPerson: (personId: string) => void;
    onAddParent: (person: Person) => void;
    onAddSpouse: (person: Person) => void;
    onAddChild: (person: Person) => void;
    onAddSibling: (person: Person) => void;
    /**
     * Remove a single relation between the focused person and `relativeId`.
     * Surfaces a confirmation prompt in the parent component.
     */
    onRemoveRelation?: (person: Person, relativeId: string, kind: PersonRelationKind) => void;
}

const PersonCardModal: React.FC<PersonCardModalProps> = ({
    open,
    person,
    persons,
    relations,
    initialTab = 'info',
    onClose,
    onEdit,
    onSelectPerson,
    onAddParent,
    onAddSpouse,
    onAddChild,
    onAddSibling,
    onRemoveRelation
}) => {
    const { t } = useTranslation('tree');
    const [tab, setTab] = useState<PersonCardTab>(initialTab);

    React.useEffect(() => {
        if (open) setTab(initialTab);
    }, [open, initialTab, person]);

    if (!person) return null;
    const lookup = buildLookup(persons);

    /**
     * Whether the "×" remove button should be shown for an item in the given
     * tab. We only show it for relations that map cleanly to a single edge in
     * the data model — siblings derived from shared parents can't be removed
     * here without breaking the parent links, so we suppress the button if no
     * explicit sibling edge exists between the two persons.
     */
    const canRemoveFromTab = (relativeId: string): boolean => {
        if (!onRemoveRelation) return false;
        if (tab === 'parents' || tab === 'spouses' || tab === 'children') return true;
        if (tab === 'siblings') {
            return relations.some(
                (r) =>
                    r.type === 'sibling' &&
                    ((r.fromId === person.id && r.toId === relativeId) ||
                        (r.fromId === relativeId && r.toId === person.id))
            );
        }
        return false;
    };

    const removalKindForTab = (): PersonRelationKind | null => {
        switch (tab) {
            case 'parents':
                return 'parent';
            case 'spouses':
                return 'spouse';
            case 'children':
                return 'child';
            case 'siblings':
                return 'sibling';
            default:
                return null;
        }
    };

    const renderList = (ids: string[], onAdd: () => void): React.ReactNode => {
        if (ids.length === 0) {
            return (
                <>
                    <Empty>{t('personCard.empty', { defaultValue: 'No records yet' })}</Empty>
                    <ActionRow>
                        <ActionButton type="button" onClick={onAdd}>
                            {t('personCard.add', { defaultValue: 'Add' })}
                        </ActionButton>
                    </ActionRow>
                </>
            );
        }
        const removalKind = removalKindForTab();
        return (
            <>
                {ids.map((id) => {
                    const rel = lookup.byId(id);
                    if (!rel) return null;
                    const showRemove = Boolean(removalKind) && canRemoveFromTab(id);
                    return (
                        <ListRow key={id}>
                            <ListItem type="button" onClick={() => onSelectPerson(id)}>
                                <ListAvatar $photo={rel.photo} />
                                <div>
                                    <div>{formatFullName(rel)}</div>
                                    <Empty>
                                        {rel.birthDate ? formatDate(rel.birthDate) : ''}
                                        {rel.deathDate ? ` — ${formatDate(rel.deathDate)}` : ''}
                                    </Empty>
                                </div>
                            </ListItem>
                            {showRemove && removalKind && onRemoveRelation && (
                                <RemoveRelationButton
                                    type="button"
                                    aria-label={t('personCard.removeRelation', {
                                        defaultValue: 'Remove relation'
                                    })}
                                    title={t('personCard.removeRelation', {
                                        defaultValue: 'Remove relation'
                                    })}
                                    onClick={() => onRemoveRelation(person, id, removalKind)}
                                >
                                    ×
                                </RemoveRelationButton>
                            )}
                        </ListRow>
                    );
                })}
                <ActionRow>
                    <ActionButton type="button" onClick={onAdd}>
                        {t('personCard.add', { defaultValue: 'Add' })}
                    </ActionButton>
                </ActionRow>
            </>
        );
    };

    return (
        <Overlay $open={open} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <ModalCard onMouseDown={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <span>{formatFullName(person)}</span>
                    <HeaderClose type="button" aria-label="close" onClick={onClose}>
                        ×
                    </HeaderClose>
                </ModalHeader>
                <ModalBody>
                    <Hero>
                        <Avatar $photo={person.photo} />
                        <div>
                            <HeroName>{formatFullName(person)}</HeroName>
                            <HeroMeta>
                                {person.birthDate ? formatDate(person.birthDate) : ''}
                                {person.deathDate ? ` — ${formatDate(person.deathDate)}` : ''}
                            </HeroMeta>
                            {person.birthPlace && <HeroMeta>{person.birthPlace}</HeroMeta>}
                        </div>
                    </Hero>

                    <Tabs>
                        <Tab type="button" $active={tab === 'info'} onClick={() => setTab('info')}>
                            {t('personCard.tabs.info', { defaultValue: 'Info' })}
                        </Tab>
                        <Tab type="button" $active={tab === 'parents'} onClick={() => setTab('parents')}>
                            {t('personCard.tabs.parents', { defaultValue: 'Parents' })}
                        </Tab>
                        <Tab type="button" $active={tab === 'spouses'} onClick={() => setTab('spouses')}>
                            {t('personCard.tabs.spouses', { defaultValue: 'Spouses' })}
                        </Tab>
                        <Tab type="button" $active={tab === 'children'} onClick={() => setTab('children')}>
                            {t('personCard.tabs.children', { defaultValue: 'Children' })}
                        </Tab>
                        <Tab type="button" $active={tab === 'siblings'} onClick={() => setTab('siblings')}>
                            {t('personCard.tabs.siblings', { defaultValue: 'Siblings' })}
                        </Tab>
                    </Tabs>

                    {tab === 'info' && (
                        <InfoBlock>
                            {person.middleName && (
                                <>
                                    <InfoLabel>{t('personCard.middleName', { defaultValue: 'Middle name' })}</InfoLabel>
                                    <InfoValue>{person.middleName}</InfoValue>
                                </>
                            )}
                            {person.maidenName && (
                                <>
                                    <InfoLabel>{t('personCard.maidenName', { defaultValue: 'Maiden name' })}</InfoLabel>
                                    <InfoValue>{person.maidenName}</InfoValue>
                                </>
                            )}
                            {person.nationality && (
                                <>
                                    <InfoLabel>
                                        {t('personCard.nationality', { defaultValue: 'Nationality' })}
                                    </InfoLabel>
                                    <InfoValue>{person.nationality}</InfoValue>
                                </>
                            )}
                            {person.occupation && (
                                <>
                                    <InfoLabel>
                                        {t('personCard.occupation', { defaultValue: 'Occupation' })}
                                    </InfoLabel>
                                    <InfoValue>{person.occupation}</InfoValue>
                                </>
                            )}
                            {person.deathPlace && (
                                <>
                                    <InfoLabel>
                                        {t('personCard.deathPlace', { defaultValue: 'Place of death' })}
                                    </InfoLabel>
                                    <InfoValue>{person.deathPlace}</InfoValue>
                                </>
                            )}
                            {person.biography && (
                                <>
                                    <InfoLabel>{t('personCard.note', { defaultValue: 'Note' })}</InfoLabel>
                                    <InfoValue>{person.biography}</InfoValue>
                                </>
                            )}
                            <ActionRow>
                                <ActionButton type="button" onClick={() => onEdit(person)}>
                                    {t('personCard.edit', { defaultValue: 'Edit' })}
                                </ActionButton>
                            </ActionRow>
                        </InfoBlock>
                    )}

                    {tab === 'parents' && renderList(getParents(person.id, relations), () => onAddParent(person))}
                    {tab === 'spouses' && renderList(getSpouses(person.id, relations), () => onAddSpouse(person))}
                    {tab === 'children' && renderList(getChildren(person.id, relations), () => onAddChild(person))}
                    {tab === 'siblings' && renderList(getSiblings(person.id, relations), () => onAddSibling(person))}
                </ModalBody>
            </ModalCard>
        </Overlay>
    );
};

export default PersonCardModal;

import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
    ActionButton,
    ActionRow,
    Avatar,
    Empty,
    Hero,
    HeroMeta,
    HeroName,
    ListAvatar,
    ListItem,
    ListRow,
    PersonModalCard,
    RemoveRelationButton
} from './PersonCardModal.styled';
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
    ModalHeader,
    ModalVariant,
    Overlay,
    Tab,
    Tabs
} from './Modal.styled';

export type PersonCardTab = 'info' | 'parents' | 'spouses' | 'children' | 'siblings';

export type PersonRelationKind = 'parent' | 'spouse' | 'child' | 'sibling';

export interface PersonCardModalProps {
    open: boolean;
    person: Person | null;
    persons: Person[];
    relations: PersonRelation[];
    initialTab?: PersonCardTab;
    /** Theme of the modal — `tree` (cream, default) or `cemetery` (dark). */
    variant?: ModalVariant;
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
    variant = 'tree',
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
            <PersonModalCard $variant={variant} onMouseDown={(e) => e.stopPropagation()}>
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
            </PersonModalCard>
        </Overlay>
    );
};

export default PersonCardModal;

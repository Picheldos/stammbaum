import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { color, font } from '@/style/mixins';
import { AddRelativeKind, Person } from '@/lib/family/types';
import { formatShortName } from '@/lib/family/relations';
import { HeaderClose, ModalBody, ModalCard, ModalHeader, Overlay } from './Modal.styled';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
`;

const Choice = styled.button`
    background: ${color('landingCta')};
    color: ${color('white')};
    border: none;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    ${font('font7')};
    font-weight: 600;

    &:hover {
        background: ${color('slateBlue')};
    }
`;

export interface AddRelativePickerProps {
    open: boolean;
    person: Person | null;
    onCancel: () => void;
    onPick: (kind: AddRelativeKind) => void;
}

const KINDS: AddRelativeKind[] = ['mother', 'father', 'spouse', 'son', 'daughter', 'brother', 'sister'];

const AddRelativePicker: React.FC<AddRelativePickerProps> = ({ open, person, onCancel, onPick }) => {
    const { t } = useTranslation('tree');
    if (!person) return null;
    return (
        <Overlay $open={open} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
            <ModalCard onMouseDown={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <span>{t('relativePicker.title', { defaultValue: 'Add relative to' })}: {formatShortName(person)}</span>
                    <HeaderClose type="button" aria-label="close" onClick={onCancel}>
                        ×
                    </HeaderClose>
                </ModalHeader>
                <ModalBody>
                    <Grid>
                        {KINDS.map((kind) => (
                            <Choice key={kind} type="button" onClick={() => onPick(kind)}>
                                {t(`relativeLabel.${kind}` as const, { defaultValue: kind })}
                            </Choice>
                        ))}
                    </Grid>
                </ModalBody>
            </ModalCard>
        </Overlay>
    );
};

export default AddRelativePicker;

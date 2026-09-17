import React from 'react';
import { useTranslation } from 'next-i18next';
import { AddRelativeKind, Person } from '@/lib/family/types';
import { formatShortName } from '@/lib/family/relations';
import { Choice, Grid } from './AddRelativePicker.styled';
import { HeaderClose, ModalBody, ModalCard, ModalHeader, Overlay } from './Modal.styled';

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

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { AddRelativeKind, Gender, Person } from '@/lib/family/types';
import {
    Field,
    FieldLabel,
    FileInputRow,
    GenderToggle,
    HeaderClose,
    Hint,
    Hints,
    Input,
    ModalBody,
    ModalCard,
    ModalHeader,
    Overlay,
    Primary,
    Tab,
    Tabs,
    Textarea,
    ToggleButton,
    ErrorText
} from './Modal.styled';
import { formatShortName } from '@/lib/family/relations';

export type AddPersonMode =
    | { kind: 'self' }
    | { kind: 'edit'; person: Person }
    | { kind: 'relative'; relativeOf: Person; relation: AddRelativeKind };

export interface AddPersonValues {
    gender: Gender;
    firstName: string;
    lastName: string;
    middleName?: string;
    maidenName?: string;
    birthDate?: string;
    birthPlace?: string;
    deathDate?: string;
    deathPlace?: string;
    biography?: string;
    photo?: string;
}

export interface AddPersonModalProps {
    open: boolean;
    mode: AddPersonMode;
    onCancel: () => void;
    onSubmit: (values: AddPersonValues) => void;
}

const KIND_DEFAULT_GENDER: Record<AddRelativeKind, Gender> = {
    mother: 'female',
    father: 'male',
    spouse: 'female',
    son: 'male',
    daughter: 'female',
    brother: 'male',
    sister: 'female'
};

const initialValues = (mode: AddPersonMode): AddPersonValues => {
    if (mode.kind === 'edit') {
        return {
            gender: mode.person.gender,
            firstName: mode.person.firstName,
            lastName: mode.person.lastName,
            middleName: mode.person.middleName,
            maidenName: mode.person.maidenName,
            birthDate: mode.person.birthDate,
            birthPlace: mode.person.birthPlace,
            deathDate: mode.person.deathDate,
            deathPlace: mode.person.deathPlace,
            biography: mode.person.biography,
            photo: mode.person.photo
        };
    }
    if (mode.kind === 'relative') {
        return {
            gender: KIND_DEFAULT_GENDER[mode.relation],
            firstName: '',
            lastName: mode.relativeOf.lastName,
            middleName: '',
            maidenName: '',
            birthDate: '',
            birthPlace: '',
            deathDate: '',
            deathPlace: '',
            biography: '',
            photo: ''
        };
    }
    return {
        gender: 'female',
        firstName: '',
        lastName: '',
        middleName: '',
        maidenName: '',
        birthDate: '',
        birthPlace: '',
        deathDate: '',
        deathPlace: '',
        biography: '',
        photo: ''
    };
};

const readImageAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

const AddPersonModal: React.FC<AddPersonModalProps> = ({ open, mode, onCancel, onSubmit }) => {
    const { t } = useTranslation('tree');
    const [values, setValues] = useState<AddPersonValues>(() => initialValues(mode));
    const [showDeath, setShowDeath] = useState<boolean>(false);
    const [showBio, setShowBio] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // Reset state whenever the modal opens with a new mode/person.
    const modeKey = useMemo(() => {
        if (mode.kind === 'edit') return `edit:${mode.person.id}`;
        if (mode.kind === 'relative') return `relative:${mode.relativeOf.id}:${mode.relation}`;
        return 'self';
    }, [mode]);

    useEffect(() => {
        if (!open) return;
        const next = initialValues(mode);
        setValues(next);
        setShowDeath(Boolean(next.deathDate || next.deathPlace));
        setShowBio(Boolean(next.biography));
        setError('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, modeKey]);

    const headerTitle = useMemo(() => {
        if (mode.kind === 'edit') return formatShortName(mode.person);
        if (mode.kind === 'relative') {
            return t(`relativeLabel.${mode.relation}` as const, {
                defaultValue: t('addPerson.titleRelative', { defaultValue: 'New relative' })
            });
        }
        return t('addPerson.titleSelf', { defaultValue: 'Add information' });
    }, [mode, t]);

    const handleFile = async (file?: File) => {
        if (!file) return;
        try {
            const data = await readImageAsDataUrl(file);
            setValues((v) => ({ ...v, photo: data }));
        } catch {
            setError(t('addPerson.errors.photo', { defaultValue: 'Could not read photo' }));
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!values.firstName.trim()) {
            setError(t('addPerson.errors.firstNameRequired', { defaultValue: 'First name is required' }));
            return;
        }
        if (!values.lastName.trim()) {
            setError(t('addPerson.errors.lastNameRequired', { defaultValue: 'Last name is required' }));
            return;
        }
        const cleaned: AddPersonValues = {
            ...values,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            middleName: values.middleName?.trim() || undefined,
            maidenName: values.maidenName?.trim() || undefined,
            birthDate: values.birthDate || undefined,
            birthPlace: values.birthPlace?.trim() || undefined,
            deathDate: showDeath ? values.deathDate || undefined : undefined,
            deathPlace: showDeath ? values.deathPlace?.trim() || undefined : undefined,
            biography: showBio ? values.biography?.trim() || undefined : undefined,
            photo: values.photo || undefined
        };
        onSubmit(cleaned);
    };

    return (
        <Overlay $open={open} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
            <ModalCard onMouseDown={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <span>{headerTitle}</span>
                    <HeaderClose type="button" aria-label="close" onClick={onCancel}>
                        ×
                    </HeaderClose>
                </ModalHeader>
                <ModalBody as="form" onSubmit={submit}>
                    <Tabs>
                        <Tab
                            type="button"
                            $active={values.gender === 'female'}
                            onClick={() => setValues((v) => ({ ...v, gender: 'female' }))}
                        >
                            {t('gender.female', { defaultValue: 'F' })}
                        </Tab>
                        <Tab
                            type="button"
                            $active={values.gender === 'male'}
                            onClick={() => setValues((v) => ({ ...v, gender: 'male' }))}
                        >
                            {t('gender.male', { defaultValue: 'M' })}
                        </Tab>
                    </Tabs>

                    <Input
                        placeholder={`${t('addPerson.fields.lastName', { defaultValue: 'Last name' })}*`}
                        value={values.lastName}
                        onChange={(e) => setValues((v) => ({ ...v, lastName: e.target.value }))}
                    />
                    <Input
                        placeholder={`${t('addPerson.fields.firstName', { defaultValue: 'First name' })}*`}
                        value={values.firstName}
                        onChange={(e) => setValues((v) => ({ ...v, firstName: e.target.value }))}
                    />
                    <Input
                        placeholder={t('addPerson.fields.middleName', { defaultValue: 'Middle name' })}
                        value={values.middleName ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, middleName: e.target.value }))}
                    />
                    {values.gender === 'female' && (
                        <Input
                            placeholder={t('addPerson.fields.maidenName', { defaultValue: 'Maiden name' })}
                            value={values.maidenName ?? ''}
                            onChange={(e) => setValues((v) => ({ ...v, maidenName: e.target.value }))}
                        />
                    )}
                    <Input
                        placeholder={t('addPerson.fields.birthPlace', { defaultValue: 'Place of birth' })}
                        value={values.birthPlace ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, birthPlace: e.target.value }))}
                    />
                    <Field>
                        <FieldLabel>{t('addPerson.fields.birthDate', { defaultValue: 'Date of birth' })}</FieldLabel>
                        <Input
                            type="date"
                            value={values.birthDate ?? ''}
                            onChange={(e) => setValues((v) => ({ ...v, birthDate: e.target.value }))}
                        />
                    </Field>

                    {showDeath && (
                        <>
                            <Field>
                                <FieldLabel>
                                    {t('addPerson.fields.deathDate', { defaultValue: 'Date of death' })}
                                </FieldLabel>
                                <Input
                                    type="date"
                                    value={values.deathDate ?? ''}
                                    onChange={(e) => setValues((v) => ({ ...v, deathDate: e.target.value }))}
                                />
                            </Field>
                            <Input
                                placeholder={t('addPerson.fields.deathPlace', { defaultValue: 'Place of death' })}
                                value={values.deathPlace ?? ''}
                                onChange={(e) => setValues((v) => ({ ...v, deathPlace: e.target.value }))}
                            />
                        </>
                    )}

                    {showBio && (
                        <Textarea
                            placeholder={t('addPerson.fields.biography', { defaultValue: 'Add a note' })}
                            value={values.biography ?? ''}
                            onChange={(e) => setValues((v) => ({ ...v, biography: e.target.value }))}
                        />
                    )}

                    <FileInputRow>
                        <span>{t('addPerson.fields.photo', { defaultValue: 'Upload a photo' })}</span>
                        <span aria-hidden>↓</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFile(e.target.files?.[0] || undefined)}
                        />
                    </FileInputRow>

                    <Hints>
                        {!showBio && (
                            <Hint type="button" onClick={() => setShowBio(true)}>
                                {t('addPerson.actions.addNote', { defaultValue: 'Add a note' })}
                            </Hint>
                        )}
                        {!showDeath && (
                            <Hint type="button" onClick={() => setShowDeath(true)}>
                                {t('addPerson.actions.addDeath', { defaultValue: 'Add date and place of death' })}
                            </Hint>
                        )}
                    </Hints>

                    {error && <ErrorText>{error}</ErrorText>}

                    <Primary type="submit">{t('addPerson.actions.save', { defaultValue: 'Save changes' })}</Primary>
                </ModalBody>
            </ModalCard>
        </Overlay>
    );
};

export { ToggleButton, GenderToggle };
export default AddPersonModal;

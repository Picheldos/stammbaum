import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { color, font } from '@/style/mixins';
import { readImageAsDataUrl } from '@/lib/family/image';
import type { Gender } from '@/lib/family/types';
import {
    ErrorText,
    Field,
    FieldLabel,
    FileInputRow,
    HeaderClose,
    Hint,
    Input,
    ModalBody,
    ModalCard,
    ModalHeader,
    Overlay,
    Primary,
    Tab,
    Tabs,
    Textarea
} from '../FamilyTree/Modal.styled';

const CemeteryModalCard = styled(ModalCard)`
    width: min(420px, 100%);

    ${Input}::placeholder,
    ${Textarea}::placeholder {
        color: #5d5d5d;
        opacity: 1;
    }
`;

const CemeteryModalHeader = styled(ModalHeader)`
    color: ${color('cream')};

    ${HeaderClose} {
        color: ${color('cream')};
    }
`;

const CemeteryTab = styled(Tab)`
    color: ${({ $active }) => ($active ? color('cream') : color('ink'))};

    &:hover {
        color: ${({ $active }) => ($active ? color('cream') : color('ink'))};
    }
`;

const CemeteryPrimary = styled(Primary)`
    color: ${color('cream')};
`;

const UploadRow = styled(FileInputRow)`
    ${font('mobileUpload')};
    color: #5d5d5d;
`;

const AdditionalHint = styled(Hint)`
    ${font('mobileOptionalAction')};
    color: ${color('ink')};
`;

export interface CemeteryPersonValues {
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
    memorialPhoto?: string;
}

const INITIAL_VALUES: CemeteryPersonValues = {
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
    photo: '',
    memorialPhoto: ''
};

export interface CemeteryAddPersonModalProps {
    open: boolean;
    submitError?: string;
    onCancel: () => void;
    onSubmit: (values: CemeteryPersonValues) => void;
}

const CemeteryAddPersonModal: React.FC<CemeteryAddPersonModalProps> = ({
    open,
    submitError,
    onCancel,
    onSubmit
}) => {
    const { t } = useTranslation('cemetery');
    const [values, setValues] = useState<CemeteryPersonValues>(INITIAL_VALUES);
    const [showAdditional, setShowAdditional] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) return;
        setValues(INITIAL_VALUES);
        setShowAdditional(false);
        setError('');
    }, [open]);

    const headerTitle = useMemo(() => {
        const fullName = [values.firstName.trim(), values.lastName.trim()].filter(Boolean).join(' ');
        return fullName || t('form.personNamePlaceholder', { defaultValue: 'First name Last name' });
    }, [t, values.firstName, values.lastName]);

    const handleFile = async (field: 'photo' | 'memorialPhoto', file?: File) => {
        if (!file) return;
        try {
            const data = await readImageAsDataUrl(file);
            setValues((current) => ({ ...current, [field]: data }));
        } catch {
            setError(t('form.errors.photo', { defaultValue: 'Could not read photo' }));
        }
    };

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!values.firstName.trim()) {
            setError(t('form.errors.firstNameRequired', { defaultValue: 'Enter a first name' }));
            return;
        }
        if (!values.lastName.trim()) {
            setError(t('form.errors.lastNameRequired', { defaultValue: 'Enter a last name' }));
            return;
        }

        onSubmit({
            ...values,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            middleName: values.middleName?.trim() || undefined,
            maidenName: values.maidenName?.trim() || undefined,
            birthDate: values.birthDate || undefined,
            birthPlace: values.birthPlace?.trim() || undefined,
            deathDate: values.deathDate || undefined,
            deathPlace: values.deathPlace?.trim() || undefined,
            biography: showAdditional ? values.biography?.trim() || undefined : undefined,
            photo: values.photo || undefined,
            memorialPhoto: values.memorialPhoto || undefined
        });
    };

    if (!open) return null;

    return (
        <Overlay
            $open={open}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cemetery-add-person-title"
            onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
        >
            <CemeteryModalCard onMouseDown={(event) => event.stopPropagation()}>
                <CemeteryModalHeader>
                    <span id="cemetery-add-person-title">{headerTitle}</span>
                    <HeaderClose type="button" aria-label="close" onClick={onCancel}>
                        ×
                    </HeaderClose>
                </CemeteryModalHeader>
                <ModalBody as="form" onSubmit={submit}>
                    <Tabs>
                        <CemeteryTab
                            type="button"
                            $active={values.gender === 'female'}
                            onClick={() => setValues((current) => ({ ...current, gender: 'female' }))}
                        >
                            {t('form.gender.female', { defaultValue: 'F' })}
                        </CemeteryTab>
                        <CemeteryTab
                            type="button"
                            $active={values.gender === 'male'}
                            onClick={() => setValues((current) => ({ ...current, gender: 'male' }))}
                        >
                            {t('form.gender.male', { defaultValue: 'M' })}
                        </CemeteryTab>
                    </Tabs>

                    <Input
                        placeholder={`${t('form.fields.lastName', { defaultValue: 'Last name' })}*`}
                        value={values.lastName}
                        onChange={(event) => setValues((current) => ({ ...current, lastName: event.target.value }))}
                    />
                    <Input
                        placeholder={`${t('form.fields.firstName', { defaultValue: 'First name' })}*`}
                        value={values.firstName}
                        onChange={(event) => setValues((current) => ({ ...current, firstName: event.target.value }))}
                    />
                    <Input
                        placeholder={t('form.fields.middleName', { defaultValue: 'Middle name' })}
                        value={values.middleName ?? ''}
                        onChange={(event) => setValues((current) => ({ ...current, middleName: event.target.value }))}
                    />
                    {values.gender === 'female' && (
                        <Input
                            placeholder={t('form.fields.maidenName', { defaultValue: 'Maiden name' })}
                            value={values.maidenName ?? ''}
                            onChange={(event) => setValues((current) => ({ ...current, maidenName: event.target.value }))}
                        />
                    )}
                    <Input
                        placeholder={t('form.fields.birthPlace', { defaultValue: 'Place of birth' })}
                        value={values.birthPlace ?? ''}
                        onChange={(event) => setValues((current) => ({ ...current, birthPlace: event.target.value }))}
                    />
                    <Field>
                        <FieldLabel>{t('form.fields.birthDate', { defaultValue: 'Date of birth' })}</FieldLabel>
                        <Input
                            type="date"
                            value={values.birthDate ?? ''}
                            onChange={(event) => setValues((current) => ({ ...current, birthDate: event.target.value }))}
                        />
                    </Field>
                    <Field>
                        <FieldLabel>{t('form.fields.deathDate', { defaultValue: 'Date of death' })}</FieldLabel>
                        <Input
                            type="date"
                            value={values.deathDate ?? ''}
                            onChange={(event) => setValues((current) => ({ ...current, deathDate: event.target.value }))}
                        />
                    </Field>
                    <Input
                        placeholder={t('form.fields.deathPlace', { defaultValue: 'Place of death' })}
                        value={values.deathPlace ?? ''}
                        onChange={(event) => setValues((current) => ({ ...current, deathPlace: event.target.value }))}
                    />

                    <UploadRow>
                        <span>{t('form.fields.relativePhoto', { defaultValue: "Upload a relative's photo" })}</span>
                        <span aria-hidden>↓</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleFile('photo', event.target.files?.[0] || undefined)}
                        />
                    </UploadRow>
                    <UploadRow>
                        <span>{t('form.fields.memorialPhoto', { defaultValue: 'Upload a monument photo' })}</span>
                        <span aria-hidden>↓</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleFile('memorialPhoto', event.target.files?.[0] || undefined)}
                        />
                    </UploadRow>

                    {showAdditional ? (
                        <Textarea
                            placeholder={t('form.fields.biography', { defaultValue: 'Additional information' })}
                            value={values.biography ?? ''}
                            onChange={(event) => setValues((current) => ({ ...current, biography: event.target.value }))}
                        />
                    ) : (
                        <AdditionalHint type="button" onClick={() => setShowAdditional(true)}>
                            {t('form.additionalInformation', { defaultValue: 'Add additional information' })}
                        </AdditionalHint>
                    )}

                    {(error || submitError) && <ErrorText role="alert">{error || submitError}</ErrorText>}
                    <CemeteryPrimary type="submit">
                        {t('form.save', { defaultValue: 'Save information' })}
                    </CemeteryPrimary>
                </ModalBody>
            </CemeteryModalCard>
        </Overlay>
    );
};

export default CemeteryAddPersonModal;

import React from 'react';
import { CemeteryAvatar as StyledAvatar, AvatarInitials } from './Cemetery.styled';
import type { CemeteryPerson } from './Cemetery.types';

export interface CemeteryAvatarProps {
    person: CemeteryPerson;
}

const initials = (person: CemeteryPerson): string => {
    const f = person.firstName?.[0] ?? '';
    const l = person.lastName?.[0] ?? '';
    return `${f}${l}`.toUpperCase() || '·';
};

/**
 * Circular relative portrait. Reuses an SVG portrait asset when available,
 * otherwise renders an initials stub — never a remote placeholder URL.
 */
const CemeteryAvatar: React.FC<CemeteryAvatarProps> = ({ person }) => {
    const label = `${person.lastName} ${person.firstName}`;

    if (person.photoUrl) {
        return (
            <StyledAvatar role="img" aria-label={label} title={label}>
                <img src={person.photoUrl} alt={label} loading="lazy" />
            </StyledAvatar>
        );
    }

    return (
        <StyledAvatar role="img" aria-label={label} $fallback>
            <AvatarInitials>{initials(person)}</AvatarInitials>
        </StyledAvatar>
    );
};

export default CemeteryAvatar;

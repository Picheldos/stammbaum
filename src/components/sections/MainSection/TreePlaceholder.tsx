import React from 'react';
import { color } from '@/style/mixins';
import { SvgRoot } from './TreePlaceholder.styled';

/** Декоративная заглушка дерева — силуэт без растровых иллюстраций */

const TreePlaceholder: React.FC<{ className?: string }> = ({ className }) => (
    <SvgRoot className={className} viewBox="0 0 320 340" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <ellipse cx="160" cy="118" rx="118" ry="104" fill={color('treeStub')} opacity={0.45} />
        <ellipse cx="92" cy="152" rx="76" ry="68" fill={color('treeStub')} opacity={0.38} />
        <ellipse cx="228" cy="148" rx="74" ry="66" fill={color('treeStub')} opacity={0.38} />
        <ellipse cx="160" cy="78" rx="88" ry="72" fill={color('treeStub')} opacity={0.52} />
        <path
            d="M146 218 L174 218 L182 294 C183 314 173 332 160 336 C147 332 137 314 138 294 Z"
            fill={color('treeStubTrunk')}
        />
        <ellipse cx="160" cy="326" rx="104" ry="22" fill={color('treeStub')} opacity={0.2} />
    </SvgRoot>
);

export default TreePlaceholder;

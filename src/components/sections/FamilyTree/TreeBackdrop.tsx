import React from 'react';

/**
 * Stylised silhouette of a deciduous tree (crown + trunk + visible roots) used
 * as a decorative backdrop behind the genealogical scene. Pure SVG so it scales
 * crisply at every zoom level and never requires an extra HTTP request.
 */
const TreeBackdrop: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 800 560" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
            <radialGradient id="crown" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#9bb37e" />
                <stop offset="100%" stopColor="#4a7043" stopOpacity="0.85" />
            </radialGradient>
            <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#735041" />
                <stop offset="100%" stopColor="#3b2a22" />
            </linearGradient>
        </defs>
        <ellipse cx="400" cy="170" rx="280" ry="170" fill="url(#crown)" opacity="0.85" />
        <ellipse cx="240" cy="220" rx="180" ry="130" fill="url(#crown)" opacity="0.6" />
        <ellipse cx="560" cy="220" rx="180" ry="130" fill="url(#crown)" opacity="0.6" />
        <ellipse cx="400" cy="100" rx="200" ry="120" fill="url(#crown)" opacity="0.75" />
        <path
            d="M380 320 L420 320 L460 470 C465 510 440 545 400 550 C360 545 335 510 340 470 Z"
            fill="url(#trunk)"
        />
        <path
            d="M380 510 C320 530 260 535 180 530 M420 510 C480 530 540 535 620 530 M395 540 C360 555 300 555 240 553 M405 540 C440 555 500 555 560 553"
            fill="none"
            stroke="#3b2a22"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
        />
    </svg>
);

export default TreeBackdrop;

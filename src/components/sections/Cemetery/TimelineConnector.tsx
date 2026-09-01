import React from 'react';
import { TimelineConnector as StyledConnector } from './Cemetery.styled';

export interface TimelineConnectorProps {
    /** `vertical` grows downward from the card (desktop); `horizontal` reaches
     *  leftward to the axis (mobile). */
    direction: 'vertical' | 'horizontal';
    /** Length of the connector in pixels. */
    length: number;
}

/**
 * Vertical (desktop) or horizontal (mobile) 1px line linking a card to the
 * timeline axis. Geometry is prop-driven so the same element adapts to
 * orientation without duplicated markup.
 */
const TimelineConnector: React.FC<TimelineConnectorProps> = ({ direction, length }) => (
    <StyledConnector $direction={direction} $length={length} />
);

export default TimelineConnector;

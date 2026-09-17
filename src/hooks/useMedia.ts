import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query.
 * Returns `initial` during SSR; updates on mount and whenever the query changes.
 */
export const useMedia = (query: string, initial = false): boolean => {
    const [matches, setMatches] = useState(initial);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mq = window.matchMedia(query);
        const onChange = () => setMatches(mq.matches);
        setMatches(mq.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, [query]);

    return matches;
};
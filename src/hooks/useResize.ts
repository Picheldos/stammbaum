import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

const useResize = (delay = 500) => {
    const [value, setValue] = useState({ w: 0, h: 0 });
    const debouncedValue = useDebounce(value, delay);
    const resizeHandler = () => setValue((prev) => ({ ...prev, w: window.innerWidth, h: window.innerHeight }));

    useEffect(() => {
        const timer = setTimeout(() => {
            const h = `${window.innerHeight * 0.01}px`;
            document.documentElement.style.setProperty('--vh', h);
            resizeHandler();
        }, 0);
        window.addEventListener('resize', resizeHandler);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    useEffect(() => {
        const h = `${window.innerHeight * 0.01}px`;
        document.documentElement.style.setProperty('--vh', h);
    }, [debouncedValue]);

    return debouncedValue;
};

export default useResize;

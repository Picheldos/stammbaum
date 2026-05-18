import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Container, SearchTrigger, SearchFieldWrap, SearchInputInner, SearchInput } from './Search.styled';
import SearchIcon from '@/icons/seach1.svg';

export interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const query = inputRef.current?.value?.trim();
            if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
                close();
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            }
        },
        [router, close]
    );

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            const tId = requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
            return () => cancelAnimationFrame(tId);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [close]);

    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            if (isOpen && wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
                close();
            }
        },
        [isOpen, close]
    );

    useEffect(() => {
        if (!isOpen) return;
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, handleClickOutside]);

    return (
        <Container ref={wrapRef}>
            <SearchTrigger type="button" onClick={open} aria-label={t('openSearch')} $isOpen={isOpen}>
                <SearchIcon />
            </SearchTrigger>
            <SearchFieldWrap $isOpen={isOpen}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%', minWidth: 0 }}>
                    <SearchInputInner>
                        <SearchInput ref={inputRef} type="search" autoComplete="off" />
                    </SearchInputInner>
                </form>
            </SearchFieldWrap>
        </Container>
    );
};

export default Search;

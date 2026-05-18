import React from 'react';
import { Container, HeaderMenuItem, HeaderMenuItemBtn } from './HeaderMenu.styled';
import Bag from '@/icons/bag1.svg';
import { useRecoilState } from 'recoil';
import { SandwichState } from '@/recoil/sandwichState/athom';
import CloseButton from '@/components/ui/CloseButton/CloseButton';
import Link from 'next/link';

export interface HeaderMenuProps {
    sandwich?: boolean;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ sandwich }) => {
    const [sandwichState, setSandwichState] = useRecoilState(SandwichState);

    const clickHandler = () => {
        setSandwichState(!sandwichState);
    };

    return (
        <Container>
            <HeaderMenuItem>
                <Link href="/cart">
                    <Bag />
                </Link>
            </HeaderMenuItem>
            {sandwich ? <CloseButton onClick={clickHandler} /> : <HeaderMenuItemBtn onClick={clickHandler}>
                    <span />
                    <span />
                    <span />
                </HeaderMenuItemBtn>}
        </Container>
    );
};

export default HeaderMenu;

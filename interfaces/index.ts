import { HeaderProps } from '@/components/common/Header/Header';
import { SandwichProps } from '@/components/common/Sandwich/Sandwich';
import React from 'react';

export type DeviceTypes = 'mobile' | 'tablet' | 'smallDesktop' | 'desktop';

export interface MetaInfo {
    title: string;
    description?: string;
    keywords?: string;
}

export interface BasePageProps {
    meta: MetaInfo;
    header: HeaderProps;
    sandwich: SandwichProps;
}

export interface BaseUI {
    className?: string;
    children?: React.ReactNode;
}

import React, { useEffect } from 'react';
import { Overlay, Content, Header, Title, CloseButton, Body } from './Popup.styled';
import { PopupProps } from './Popup.types';

export const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <Overlay isOpen={isOpen} onClick={closeOnOverlayClick ? onClose : undefined}>
      <Content className={className}>
        <Header>
          <Title>{title}</Title>
          {showCloseButton && (
            <CloseButton onClick={onClose}>
              &times;
            </CloseButton>
          )}
        </Header>
        <Body>
          {children}
        </Body>
      </Content>
    </Overlay>
  );
};
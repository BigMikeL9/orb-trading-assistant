"use client";

import { useEffect, useId, useRef } from "react";
import {
  Backdrop,
  Body,
  CloseButton,
  Dialog,
  Header,
  Title,
} from "./Modal.styles";
import type { ModalProps } from "./Modal.types";

export function Modal({ children, isOpen, onClose, title }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeElement = document.activeElement;
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || dialogRef.current === null) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (firstElement === undefined || lastElement === undefined) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (activeElement instanceof HTMLElement) {
        activeElement.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <Backdrop onMouseDown={onClose}>
      <Dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-modal="true"
        role="dialog"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Header>
          <Title id={titleId}>{title}</Title>
          <CloseButton type="button" onClick={onClose}>
            Close
          </CloseButton>
        </Header>
        <Body>{children}</Body>
      </Dialog>
    </Backdrop>
  );
}

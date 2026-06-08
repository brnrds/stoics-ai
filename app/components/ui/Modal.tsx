"use client";

import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { AnimatePresence, motion } from "motion/react";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
} as const;

type ModalSize = keyof typeof sizeClasses;

const BACKDROP_BLUR = "blur(4px)";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const overlayVariants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { opacity: 1, backdropFilter: BACKDROP_BLUR },
  exit: { opacity: 0, backdropFilter: "blur(0px)" },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const overlayTransition = { duration: 0.2, ease: "easeOut" as const };
const contentTransition = { duration: 0.2, ease: [0.32, 0.72, 0, 1] as const };
const reducedMotionTransition = { duration: 0 };

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.tabIndex !== -1 &&
      element.getClientRects().length > 0,
  );
}

function inertBackground(modalRoot: HTMLElement) {
  const inerted: HTMLElement[] = [];
  let node: HTMLElement | null = modalRoot;

  while (node) {
    const parent: HTMLElement | null = node.parentElement;
    if (!parent) break;

    for (const child of Array.from(parent.children)) {
      if (child !== node && child instanceof HTMLElement) {
        child.setAttribute("aria-hidden", "true");
        child.inert = true;
        inerted.push(child);
      }
    }
    node = parent;
  }

  return inerted;
}

function restoreInerted(elements: HTMLElement[]) {
  for (const element of elements) {
    element.removeAttribute("aria-hidden");
    element.inert = false;
  }
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  showClose?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  title?: string;
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  size = "md",
  showClose = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  title,
  className,
}: ModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const inertedElementsRef = useRef<HTMLElement[]>([]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") onClose();
    },
    [closeOnEscape, onClose],
  );

  const handleTabTrap = useCallback((event: KeyboardEvent) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = getFocusableElements(dialogRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTabTrap);
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    if (dialog) {
      inertedElementsRef.current = inertBackground(dialog);

      const focusable = getFocusableElements(dialog);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialog.tabIndex = -1;
        dialog.focus();
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTabTrap);
      document.body.style.overflow = "";
      restoreInerted(inertedElementsRef.current);
      inertedElementsRef.current = [];
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [open, handleEscape, handleTabTrap]);

  const handleOverlayClick = (event: MouseEvent) => {
    if (closeOnOverlay && event.target === event.currentTarget) onClose();
  };

  const motionTransition = prefersReducedMotion
    ? reducedMotionTransition
    : undefined;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={motionTransition ?? overlayTransition}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.18)" }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={motionTransition ?? contentTransition}
            className={cn(
              "relative w-full rounded-lg border border-border bg-surface shadow-lg",
              sizeClasses[size],
              className,
            )}
          >
            {title ? (
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <h2
                  id={titleId}
                  className="text-sm font-semibold text-foreground"
                >
                  {title}
                </h2>
                {showClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ) : null}

            {!title && showClose ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
              >
                <XIcon className="h-4 w-4" />
              </button>
            ) : null}

            <div className={cn(!title && showClose && "pt-10", "p-5")}>
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "-mx-5 -mb-5 mt-4 flex items-center justify-end gap-2 border-t border-border bg-surface-muted px-5 py-3.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

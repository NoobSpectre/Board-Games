'use client'

import { useState } from "react";

type UseDisclosureProps = {
  initial: boolean;
};

export function useDisclosure(
  { initial }: UseDisclosureProps = { initial: false }
) {
  const [isOpen, setIsOpen] = useState(initial);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(pv => !pv);

  return { isOpen, onOpen, onClose, onToggle };
}

import { Modal, ModalContent } from "@heroui/react";

const modalClasses = {
  backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
  base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
  header: "border-b-[1px] border-[#292f46]",
  footer: "border-t-[1px] border-[#292f46]",
  closeButton: "hover:bg-white/5 active:bg-white/10",
}

export default function DarkModal({ isOpen, onOpenChange, children }) {
  return (
    <Modal backdrop="opaque" classNames={modalClasses} isOpen={isOpen} radius="lg" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => children(onClose)}
      </ModalContent>
    </Modal>
  )
}

export { modalClasses }

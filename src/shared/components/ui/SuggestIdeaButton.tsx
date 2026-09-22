import { useState } from "react";
import { HiOutlineLightBulb } from "react-icons/hi2";
import { LABELS_FEEDBACK_MODAL } from "../../data";
import FeedbackModal from "./FeedbackModal";

const SuggestIdeaButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        aria-label={LABELS_FEEDBACK_MODAL.button}
      >
        <HiOutlineLightBulb className="text-lg" />
        {LABELS_FEEDBACK_MODAL.button}
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SuggestIdeaButton;

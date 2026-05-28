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
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:bg-emerald-700"
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

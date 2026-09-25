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
        aria-label={LABELS_FEEDBACK_MODAL.button}
        title={LABELS_FEEDBACK_MODAL.button}
        className="group fixed bottom-6 right-6 z-40 inline-flex h-12 max-w-12 items-center overflow-hidden rounded-full bg-primary text-primary-foreground shadow-lg transition-[max-width,padding,box-shadow] duration-700 ease-in-out hover:max-w-64 hover:pr-5 hover:shadow-xl focus-visible:max-w-64 focus-visible:pr-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center">
          <HiOutlineLightBulb className="text-xl transition-transform duration-600 ease-in-out group-hover:scale-110 group-hover:rotate-6" />
        </span>
        <span className="whitespace-nowrap pr-1 text-sm font-semibold opacity-0 transition-opacity duration-500 delay-200 ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100">
          {LABELS_FEEDBACK_MODAL.button}
        </span>
      </button>

      <FeedbackModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SuggestIdeaButton;

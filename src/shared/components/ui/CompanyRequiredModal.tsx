import {
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import { useNavigate } from "react-router";
import { LABELS_COMPANY_REQUIRED_MODAL, PATHS } from "../../data";
import Modal from "./Modal";

type CompanyRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CompanyRequiredModal = ({
  isOpen,
  onClose,
}: CompanyRequiredModalProps) => {
  const navigate = useNavigate();

  const handleGoToSettings = () => {
    onClose();
    navigate(PATHS.SETTINGS);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={LABELS_COMPANY_REQUIRED_MODAL.title}
      subtitle={LABELS_COMPANY_REQUIRED_MODAL.subtitle}
      maxWidthClass="max-w-md"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-4 rounded-xl bg-accent p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <HiOutlineBuildingOffice2 className="text-xl" />
          </div>
          <div className="space-y-1">
            <p className="text-sm leading-relaxed text-foreground">
              {LABELS_COMPANY_REQUIRED_MODAL.description}
            </p>
            <p className="text-xs font-medium text-accent-foreground">
              {LABELS_COMPANY_REQUIRED_MODAL.highlight}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {LABELS_COMPANY_REQUIRED_MODAL.actions.cancel}
          </button>
          <button
            type="button"
            onClick={handleGoToSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            {LABELS_COMPANY_REQUIRED_MODAL.actions.goToSettings}
            <HiOutlineArrowRight className="text-base" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CompanyRequiredModal;

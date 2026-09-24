import { useForm } from "react-hook-form";
import {
  HiGlobeAlt,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiUser,
} from "react-icons/hi2";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Modal } from "../../shared/components/ui";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import { useCreateClient } from "../../shared/hooks";
import type { CreateClientDto } from "../../shared/types/client";

type CreateClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CreateClientFormValues = {
  name: string;
  website: string;
  email: string;
  phone: string;
};

const CreateClientModal = ({ isOpen, onClose }: CreateClientModalProps) => {
  const createClient = useCreateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientFormValues>({
    defaultValues: {
      name: "",
      website: "",
      email: "",
      phone: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateClientFormValues) => {
    const payload: CreateClientDto = {
      name: data.name.trim(),
      website: data.website.trim() || undefined,
      email: data.email.trim() || undefined,
      phone: data.phone.trim() || undefined,
    };

    createClient.mutate(payload, {
      onSuccess: () => {
        toast.success(LABELS_CLIENTS_PAGE.createModal.success);
        handleClose();
      },
      onError: (error) => {
        toast.error((error as Error).message);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={LABELS_CLIENTS_PAGE.createModal.title}
      subtitle={LABELS_CLIENTS_PAGE.createModal.subtitle}
      maxWidthClass="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="clientName"
          label={LABELS_CLIENTS_PAGE.createModal.fields.name.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.name.placeholder}
          icon={HiUser}
          registration={register("name", {
            required: LABELS_CLIENTS_PAGE.validation.nameRequired,
          })}
          error={errors.name?.message}
        />

        <FormField
          id="clientWebsite"
          type="url"
          label={LABELS_CLIENTS_PAGE.createModal.fields.website.label}
          placeholder={
            LABELS_CLIENTS_PAGE.createModal.fields.website.placeholder
          }
          icon={HiGlobeAlt}
          registration={register("website")}
        />

        <FormField
          id="clientEmail"
          type="email"
          label={LABELS_CLIENTS_PAGE.createModal.fields.email.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.email.placeholder}
          icon={HiOutlineEnvelope}
          registration={register("email", {
            validate: (value) =>
              !value.trim() ||
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
              LABELS_CLIENTS_PAGE.validation.emailInvalid,
          })}
          error={errors.email?.message}
        />

        <FormField
          id="clientPhone"
          type="tel"
          label={LABELS_CLIENTS_PAGE.createModal.fields.phone.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.phone.placeholder}
          icon={HiOutlinePhone}
          registration={register("phone")}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {LABELS_CLIENTS_PAGE.createModal.cancel}
          </button>
          <button
            type="submit"
            disabled={createClient.isPending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {createClient.isPending
              ? LABELS_CLIENTS_PAGE.createModal.submitting
              : LABELS_CLIENTS_PAGE.createModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClientModal;

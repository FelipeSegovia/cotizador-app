import { useEffect } from "react";
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
import { useUpdateClient } from "../../shared/hooks";
import type { Client, UpdateClientDto } from "../../shared/types/client";

type EditClientFormValues = {
  name: string;
  website: string;
  email: string;
  phone: string;
};

type EditClientModalProps = {
  client: Client | null;
  onClose: () => void;
};

const EditClientModal = ({ client, onClose }: EditClientModalProps) => {
  const updateClient = useUpdateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditClientFormValues>({
    defaultValues: {
      name: "",
      website: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!client) {
      return;
    }
    reset({
      name: client.name,
      website: client.website ?? "",
      email: client.email ?? "",
      phone: client.phone ?? "",
    });
  }, [client, reset]);

  const onSubmit = (data: EditClientFormValues) => {
    if (!client) {
      return;
    }

    const website = data.website.trim();
    const email = data.email.trim();
    const phone = data.phone.trim();
    const clearedEmail = !email && Boolean(client.email);
    const clearedPhone = !phone && Boolean(client.phone);

    const payload: UpdateClientDto = {
      name: data.name.trim(),
      website,
      email,
      phone,
      ...(clearedEmail || clearedPhone
        ? {
            contacts: {
              ...(clearedEmail ? { email: false } : {}),
              ...(clearedPhone ? { phone: false, whatsapp: false } : {}),
            },
          }
        : {}),
    };

    updateClient.mutate(
      { id: client.id, payload },
      {
        onSuccess: () => {
          toast.success(LABELS_CLIENTS_PAGE.editModal.success);
          onClose();
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={Boolean(client)}
      onClose={onClose}
      title={LABELS_CLIENTS_PAGE.editModal.title}
      subtitle={LABELS_CLIENTS_PAGE.editModal.subtitle}
      maxWidthClass="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="editClientName"
          label={LABELS_CLIENTS_PAGE.createModal.fields.name.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.name.placeholder}
          icon={HiUser}
          registration={register("name", {
            required: LABELS_CLIENTS_PAGE.validation.nameRequired,
          })}
          error={errors.name?.message}
        />

        <FormField
          id="editClientWebsite"
          type="url"
          label={LABELS_CLIENTS_PAGE.createModal.fields.website.label}
          placeholder={
            LABELS_CLIENTS_PAGE.createModal.fields.website.placeholder
          }
          icon={HiGlobeAlt}
          registration={register("website")}
        />

        <FormField
          id="editClientEmail"
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
          id="editClientPhone"
          type="tel"
          label={LABELS_CLIENTS_PAGE.createModal.fields.phone.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.phone.placeholder}
          icon={HiOutlinePhone}
          registration={register("phone")}
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {LABELS_CLIENTS_PAGE.createModal.cancel}
          </button>
          <button
            type="submit"
            disabled={updateClient.isPending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {updateClient.isPending
              ? LABELS_CLIENTS_PAGE.editModal.submitting
              : LABELS_CLIENTS_PAGE.editModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditClientModal;

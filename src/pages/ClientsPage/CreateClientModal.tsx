import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiGlobeAlt, HiUser } from "react-icons/hi2";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Modal } from "../../shared/components/ui";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import { useCreateClient } from "../../shared/hooks";
import type { CreateClientDto } from "../../shared/types/client";
import {
  isValidClientEmail,
  MAX_CLIENT_EMAILS,
  MAX_CLIENT_PHONES,
  MAX_PHONE_LENGTH,
  normalizeClientTags,
  sanitizeClientEmails,
  sanitizeClientPhones,
} from "./client-utils";
import StringListField from "./StringListField";
import TagChipsInput from "./TagChipsInput";

type CreateClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type CreateClientFormValues = {
  name: string;
  website: string;
};

const CreateClientModal = ({ isOpen, onClose }: CreateClientModalProps) => {
  const createClient = useCreateClient();
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [emailErrors, setEmailErrors] = useState<(string | undefined)[]>([]);
  const [phoneErrors, setPhoneErrors] = useState<(string | undefined)[]>([]);
  const [tagError, setTagError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClientFormValues>({
    defaultValues: {
      name: "",
      website: "",
    },
  });

  const resetLists = () => {
    setEmails([]);
    setPhones([]);
    setTags([]);
    setEmailErrors([]);
    setPhoneErrors([]);
    setTagError(null);
  };

  const handleClose = () => {
    reset();
    resetLists();
    onClose();
  };

  const validateLists = () => {
    const nextEmailErrors = emails.map((value) => {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      return isValidClientEmail(trimmed)
        ? undefined
        : LABELS_CLIENTS_PAGE.validation.emailInvalid;
    });
    const nextPhoneErrors = phones.map((value) => {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      return trimmed.length <= MAX_PHONE_LENGTH
        ? undefined
        : LABELS_CLIENTS_PAGE.validation.phoneInvalid;
    });

    setEmailErrors(nextEmailErrors);
    setPhoneErrors(nextPhoneErrors);

    return (
      !nextEmailErrors.some(Boolean) &&
      !nextPhoneErrors.some(Boolean) &&
      !tagError
    );
  };

  const onSubmit = (data: CreateClientFormValues) => {
    if (!validateLists()) return;

    const cleanEmails = sanitizeClientEmails(emails);
    const cleanPhones = sanitizeClientPhones(phones);
    const cleanTags = normalizeClientTags(tags);

    if (cleanEmails.length > MAX_CLIENT_EMAILS) {
      toast.error(LABELS_CLIENTS_PAGE.validation.maxEmails);
      return;
    }
    if (cleanPhones.length > MAX_CLIENT_PHONES) {
      toast.error(LABELS_CLIENTS_PAGE.validation.maxPhones);
      return;
    }

    const payload: CreateClientDto = {
      name: data.name.trim(),
      website: data.website.trim() || undefined,
      ...(cleanEmails.length > 0 ? { emails: cleanEmails } : {}),
      ...(cleanPhones.length > 0 ? { phones: cleanPhones } : {}),
      ...(cleanTags.length > 0 ? { tags: cleanTags } : {}),
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

        <StringListField
          id="clientEmails"
          label={LABELS_CLIENTS_PAGE.createModal.fields.emails.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.emails.placeholder}
          addLabel={LABELS_CLIENTS_PAGE.createModal.fields.emails.add}
          values={emails}
          type="email"
          maxItems={MAX_CLIENT_EMAILS}
          errors={emailErrors}
          onChange={(next) => {
            setEmails(next);
            setEmailErrors([]);
          }}
        />

        <StringListField
          id="clientPhones"
          label={LABELS_CLIENTS_PAGE.createModal.fields.phones.label}
          placeholder={LABELS_CLIENTS_PAGE.createModal.fields.phones.placeholder}
          addLabel={LABELS_CLIENTS_PAGE.createModal.fields.phones.add}
          values={phones}
          type="tel"
          maxItems={MAX_CLIENT_PHONES}
          errors={phoneErrors}
          onChange={(next) => {
            setPhones(next);
            setPhoneErrors([]);
          }}
        />

        <TagChipsInput
          tags={tags}
          onChange={setTags}
          error={tagError}
          onErrorChange={setTagError}
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

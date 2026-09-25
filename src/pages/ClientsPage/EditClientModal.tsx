"use no memo";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiGlobeAlt, HiUser } from "react-icons/hi2";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Modal } from "../../shared/components/ui";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import { useUpdateClient } from "../../shared/hooks";
import type { Client, UpdateClientDto } from "../../shared/types/client";
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

type EditClientFormValues = {
  name: string;
  website: string;
};

type EditClientModalProps = {
  client: Client;
  onClose: () => void;
};

const EditClientModal = ({ client, onClose }: EditClientModalProps) => {
  const updateClient = useUpdateClient();
  const [emails, setEmails] = useState<string[]>(() => [...client.emails]);
  const [phones, setPhones] = useState<string[]>(() => [...client.phones]);
  const [tags, setTags] = useState<string[]>(() => [...client.tags]);
  const [emailErrors, setEmailErrors] = useState<(string | undefined)[]>([]);
  const [phoneErrors, setPhoneErrors] = useState<(string | undefined)[]>([]);
  const [tagError, setTagError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditClientFormValues>({
    defaultValues: {
      name: client.name,
      website: client.website ?? "",
    },
  });

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

  const onSubmit = (data: EditClientFormValues) => {
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

    const clearedEmails = cleanEmails.length === 0 && client.emails.length > 0;
    const clearedPhones = cleanPhones.length === 0 && client.phones.length > 0;

    const payload: UpdateClientDto = {
      name: data.name.trim(),
      website: data.website.trim(),
      emails: cleanEmails,
      phones: cleanPhones,
      tags: cleanTags,
      ...(clearedEmails || clearedPhones
        ? {
            contacts: {
              ...(clearedEmails ? { email: false } : {}),
              ...(clearedPhones ? { phone: false, whatsapp: false } : {}),
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
      isOpen
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

        <StringListField
          id="editClientEmails"
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
          id="editClientPhones"
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

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiDevicePhoneMobile, HiLockClosed, HiUser } from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { LABELS_SETTINGS_PAGE } from "../../data";
import { useCurrentUser } from "../../hooks";
import { updateCurrentUser } from "../../services";
import useAuthStore from "../../store/useAuthStore";
import type { UpdateCurrentUserDto, User } from "../../types/auth";
import { SectionCard } from "../ui";
import FormField from "./FormField";

type ProfileFormValues = UpdateCurrentUserDto;

const EMPTY_PROFILE_FORM: ProfileFormValues = {
  name: "",
  mobilePhone: "",
};

const PersonalProfileForm = () => {
  const queryClient = useQueryClient();
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const currentUserQuery = useCurrentUser();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const profileUser: User | null = currentUserQuery.data ?? storeUser ?? null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: EMPTY_PROFILE_FORM,
  });

  useEffect(() => {
    if (!profileUser) {
      return;
    }
    reset({
      name: profileUser.name,
      mobilePhone: profileUser.mobilePhone ?? "",
    });
  }, [profileUser, reset]);

  const saveMutation = useMutation({
    mutationFn: (payload: ProfileFormValues) => updateCurrentUser(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      setUser(user);
      reset({
        name: user.name,
        mobilePhone: user.mobilePhone ?? "",
      });
      setSaveMessage(LABELS_SETTINGS_PAGE.profileCard.saveSuccess);
    },
    onError: () => {
      setSaveMessage(null);
    },
  });

  useEffect(() => {
    if (!saveMessage) {
      return;
    }
    const timerId = window.setTimeout(() => setSaveMessage(null), 4000);
    return () => window.clearTimeout(timerId);
  }, [saveMessage]);

  const onSubmit = (data: ProfileFormValues) => {
    setSaveMessage(null);
    saveMutation.mutate({
      name: data.name.trim(),
      mobilePhone: data.mobilePhone.trim(),
    });
  };

  return (
    <SectionCard title={LABELS_SETTINGS_PAGE.profileCard.title} icon={HiUser}>
      <p className="mb-5 text-xs text-slate-500">
        {LABELS_SETTINGS_PAGE.profileCard.hint}
      </p>

      {currentUserQuery.isPending && !profileUser ? (
        <p className="text-sm text-slate-500">
          {LABELS_SETTINGS_PAGE.loadingUser}
        </p>
      ) : null}

      {currentUserQuery.isError && !profileUser ? (
        <p className="text-sm text-rose-600">
          {currentUserQuery.error instanceof Error
            ? currentUserQuery.error.message
            : "No se pudo cargar el perfil."}
        </p>
      ) : null}

      {profileUser ? (
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            id="profileName"
            label={LABELS_SETTINGS_PAGE.profileCard.fields.name.label}
            registration={register("name", {
              required: LABELS_SETTINGS_PAGE.profileCard.fields.name.required,
            })}
            error={errors.name?.message}
          />

          <FormField
            id="profileMobilePhone"
            label={LABELS_SETTINGS_PAGE.profileCard.fields.mobilePhone.label}
            type="tel"
            icon={HiDevicePhoneMobile}
            registration={register("mobilePhone")}
            error={errors.mobilePhone?.message}
          />

          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700">
              {LABELS_SETTINGS_PAGE.profileCard.fields.email.label}
            </span>
            <div className="flex items-center rounded-xl border border-slate-200 bg-sky-50/80 px-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]">
              <MdOutlineEmail className="shrink-0 text-lg text-slate-400" />
              <input
                readOnly
                value={profileUser.email}
                className="w-full cursor-default border-none bg-transparent px-2 py-3 text-sm text-slate-700 outline-none"
              />
              <HiLockClosed
                className="shrink-0 text-lg text-slate-400"
                aria-hidden
              />
            </div>
          </div>
          {saveMutation.isError ? (
            <p className="text-sm font-medium text-rose-600">
              {(saveMutation.error as Error).message}
            </p>
          ) : null}

          {saveMessage ? (
            <p className="text-sm font-medium text-emerald-700">
              {saveMessage}
            </p>
          ) : null}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveMutation.isPending
                ? LABELS_SETTINGS_PAGE.profileCard.saving
                : LABELS_SETTINGS_PAGE.profileCard.saveButton}
            </button>
          </div>
        </form>
      ) : null}
    </SectionCard>
  );
};

export default PersonalProfileForm;

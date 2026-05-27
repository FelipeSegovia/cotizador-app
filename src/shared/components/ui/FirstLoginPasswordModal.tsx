import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiLockClosed } from "react-icons/hi2";
import { toast } from "sonner";
import LABELS_ADMIN_USERS_PAGE from "../../data/labels-admin-users-page";
import { useChangeCurrentUserPassword } from "../../hooks/useUserMutations";
import useAuthStore from "../../store/useAuthStore";
import FormField from "../forms/FormField";
import Modal from "./Modal";

type PasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

const FirstLoginPasswordModal = () => {
  const user = useAuthStore((s) => s.user);
  const mustChange = user?.mustChangePassword ?? false;
  const [showPassword, setShowPassword] = useState(false);
  const changePassword = useChangeCurrentUserPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!mustChange) {
    return null;
  }

  const onSubmit = (data: PasswordFormValues) => {
    changePassword.mutate(
      { newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success(LABELS_ADMIN_USERS_PAGE.firstLoginModal.success);
          reset();
        },
      },
    );
  };

  return (
    <Modal
      isOpen
      dismissible={false}
      title={LABELS_ADMIN_USERS_PAGE.firstLoginModal.title}
      subtitle={LABELS_ADMIN_USERS_PAGE.firstLoginModal.subtitle}
      maxWidthClass="max-w-md"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="newPassword"
          type={showPassword ? "text" : "password"}
          label={LABELS_ADMIN_USERS_PAGE.firstLoginModal.newPassword}
          icon={HiLockClosed}
          registration={register("newPassword", {
            required: LABELS_ADMIN_USERS_PAGE.validation.passwordRequired,
            minLength: {
              value: 8,
              message: LABELS_ADMIN_USERS_PAGE.firstLoginModal.minLength,
            },
          })}
          error={errors.newPassword?.message}
        />

        <FormField
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          label={LABELS_ADMIN_USERS_PAGE.firstLoginModal.confirmPassword}
          icon={HiLockClosed}
          registration={register("confirmPassword", {
            required: LABELS_ADMIN_USERS_PAGE.validation.passwordRequired,
            validate: (value, formValues) =>
              value === formValues.newPassword ||
              LABELS_ADMIN_USERS_PAGE.firstLoginModal.mismatch,
          })}
          error={errors.confirmPassword?.message}
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="rounded border-slate-300"
          />
          Mostrar contraseñas
        </label>

        {changePassword.isError ? (
          <p className="text-sm text-rose-600">
            {(changePassword.error as Error).message}
          </p>
        ) : null}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={changePassword.isPending}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {changePassword.isPending
              ? LABELS_ADMIN_USERS_PAGE.firstLoginModal.submitting
              : LABELS_ADMIN_USERS_PAGE.firstLoginModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FirstLoginPasswordModal;

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiDevicePhoneMobile,
  HiIdentification,
  HiLockClosed,
  HiUser,
} from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Modal } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import { isMswEnabled } from "../../shared/utils";
import { useCreateUser } from "../../shared/hooks/useUserMutations";
import type { CreateUserDto } from "../../shared/types/auth";

type CreateUserFormValues = CreateUserDto;

type CreateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
  const createUser = useCreateUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      mobilePhone: "",
      role: "common",
      password: "",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateUserFormValues) => {
    createUser.mutate(
      {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        mobilePhone: data.mobilePhone.trim(),
        role: data.role,
        password: data.password,
      },
      {
        onSuccess: () => {
          toast.success(LABELS_ADMIN_USERS_PAGE.createModal.success);
          if (isMswEnabled()) {
            toast.info(LABELS_ADMIN_USERS_PAGE.createModal.emailSimulated);
          }
          handleClose();
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={LABELS_ADMIN_USERS_PAGE.createModal.title}
      subtitle={LABELS_ADMIN_USERS_PAGE.createModal.subtitle}
      maxWidthClass="max-w-xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="createName"
          label={LABELS_ADMIN_USERS_PAGE.createModal.fields.name.label}
          placeholder={LABELS_ADMIN_USERS_PAGE.createModal.fields.name.placeholder}
          icon={HiUser}
          registration={register("name", {
            required: LABELS_ADMIN_USERS_PAGE.validation.nameRequired,
          })}
          error={errors.name?.message}
        />

        <FormField
          id="createEmail"
          type="email"
          label={LABELS_ADMIN_USERS_PAGE.createModal.fields.email.label}
          placeholder={
            LABELS_ADMIN_USERS_PAGE.createModal.fields.email.placeholder
          }
          icon={MdOutlineEmail}
          registration={register("email", {
            required: LABELS_ADMIN_USERS_PAGE.validation.emailRequired,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: LABELS_ADMIN_USERS_PAGE.validation.emailInvalid,
            },
          })}
          error={errors.email?.message}
        />

        <FormField
          id="createPhone"
          type="tel"
          label={LABELS_ADMIN_USERS_PAGE.createModal.fields.phone.label}
          placeholder={
            LABELS_ADMIN_USERS_PAGE.createModal.fields.phone.placeholder
          }
          icon={HiDevicePhoneMobile}
          registration={register("mobilePhone")}
        />

        <div className="space-y-2">
          <label
            htmlFor="createRole"
            className="block text-sm font-semibold text-foreground"
          >
            {LABELS_ADMIN_USERS_PAGE.createModal.fields.role.label}
          </label>
          <div className="flex items-center rounded-xl border border-border bg-card px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
            <HiIdentification className="shrink-0 text-lg text-muted-foreground" />
            <select
              id="createRole"
              className="w-full border-none bg-transparent px-2 py-3 text-sm text-foreground outline-none"
              {...register("role", {
                required: LABELS_ADMIN_USERS_PAGE.validation.roleRequired,
              })}
            >
              <option value="common">
                {LABELS_ADMIN_USERS_PAGE.roles.common}
              </option>
              <option value="admin">
                {LABELS_ADMIN_USERS_PAGE.roles.admin}
              </option>
            </select>
          </div>
          {errors.role?.message ? (
            <p className="text-xs font-medium text-destructive">
              {errors.role.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <FormField
            id="createPassword"
            type={showPassword ? "text" : "password"}
            label={LABELS_ADMIN_USERS_PAGE.createModal.fields.password.label}
            placeholder={
              LABELS_ADMIN_USERS_PAGE.createModal.fields.password.placeholder
            }
            icon={HiLockClosed}
            registration={register("password", {
              required: LABELS_ADMIN_USERS_PAGE.validation.passwordRequired,
              minLength: {
                value: 8,
                message: LABELS_ADMIN_USERS_PAGE.validation.passwordMin,
              },
            })}
            error={errors.password?.message}
          />
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              className="rounded border-border"
            />
            Mostrar contraseña
          </label>
          <p className="text-xs text-muted-foreground">
            {LABELS_ADMIN_USERS_PAGE.createModal.fields.password.hint}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {LABELS_ADMIN_USERS_PAGE.createModal.cancel}
          </button>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {createUser.isPending
              ? LABELS_ADMIN_USERS_PAGE.createModal.submitting
              : LABELS_ADMIN_USERS_PAGE.createModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;

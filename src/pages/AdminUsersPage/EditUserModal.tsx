import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiDevicePhoneMobile, HiIdentification, HiUser } from "react-icons/hi2";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Modal } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import { useUpdateUser } from "../../shared/hooks/useUserMutations";
import type { User, UserRole } from "../../shared/types/auth";

type EditUserFormValues = {
  name: string;
  mobilePhone: string;
  role: UserRole;
};

type EditUserModalProps = {
  user: User | null;
  onClose: () => void;
};

const EditUserModal = ({ user, onClose }: EditUserModalProps) => {
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    defaultValues: { name: "", mobilePhone: "", role: "common" },
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    reset({
      name: user.name,
      mobilePhone: user.mobilePhone ?? "",
      role: user.role,
    });
  }, [user, reset]);

  const onSubmit = (data: EditUserFormValues) => {
    if (!user) {
      return;
    }

    updateUser.mutate(
      {
        id: user.id,
        payload: {
          name: data.name.trim(),
          mobilePhone: data.mobilePhone.trim(),
          role: data.role,
        },
      },
      {
        onSuccess: () => {
          toast.success(LABELS_ADMIN_USERS_PAGE.editModal.success);
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
      isOpen={Boolean(user)}
      onClose={onClose}
      title={LABELS_ADMIN_USERS_PAGE.editModal.title}
      subtitle={LABELS_ADMIN_USERS_PAGE.editModal.subtitle}
      maxWidthClass="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="editName"
          label={LABELS_ADMIN_USERS_PAGE.createModal.fields.name.label}
          icon={HiUser}
          registration={register("name", {
            required: LABELS_ADMIN_USERS_PAGE.validation.nameRequired,
          })}
          error={errors.name?.message}
        />

        <FormField
          id="editPhone"
          type="tel"
          label={LABELS_ADMIN_USERS_PAGE.createModal.fields.phone.label}
          icon={HiDevicePhoneMobile}
          registration={register("mobilePhone")}
        />

        <div className="space-y-2">
          <label
            htmlFor="editRole"
            className="block text-sm font-semibold text-slate-700"
          >
            {LABELS_ADMIN_USERS_PAGE.createModal.fields.role.label}
          </label>
          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]">
            <HiIdentification className="shrink-0 text-lg text-slate-400" />
            <select
              id="editRole"
              className="w-full border-none bg-transparent px-2 py-3 text-sm text-slate-700 outline-none"
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
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {LABELS_ADMIN_USERS_PAGE.createModal.cancel}
          </button>
          <button
            type="submit"
            disabled={updateUser.isPending}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {updateUser.isPending
              ? LABELS_ADMIN_USERS_PAGE.editModal.submitting
              : LABELS_ADMIN_USERS_PAGE.editModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;

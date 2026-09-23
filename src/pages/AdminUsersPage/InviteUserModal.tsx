import { useForm } from "react-hook-form";
import { HiBuildingOffice2, HiIdentification, HiUser } from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Modal } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import { isMswEnabled } from "../../shared/utils";
import { useCreateInvitation } from "../../shared/hooks/useInvitations";
import type { InvitationRole } from "../../shared/types/auth";
import type { Company } from "../../shared/types/company";

type InviteFormValues = {
  name: string;
  email: string;
  companyId: string;
  role: InvitationRole;
};

type InviteUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  actorRole: "admin" | "business";
  companies?: Company[];
  fixedCompanyId?: string;
};

const InviteUserModal = ({
  isOpen,
  onClose,
  actorRole,
  companies = [],
  fixedCompanyId,
}: InviteUserModalProps) => {
  const createInvitation = useCreateInvitation();
  const isAdmin = actorRole === "admin";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    defaultValues: {
      name: "",
      email: "",
      companyId: fixedCompanyId ?? "",
      role: isAdmin ? "business" : "common",
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: InviteFormValues) => {
    const payload =
      isAdmin
        ? {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            companyId: data.companyId,
            role: data.role,
          }
        : {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
          };

    createInvitation.mutate(payload, {
      onSuccess: () => {
        toast.success(LABELS_ADMIN_USERS_PAGE.inviteModal.success);
        if (isMswEnabled()) {
          toast.info(LABELS_ADMIN_USERS_PAGE.inviteModal.emailSimulated);
        }
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
      title={LABELS_ADMIN_USERS_PAGE.inviteModal.title}
      subtitle={LABELS_ADMIN_USERS_PAGE.inviteModal.subtitle}
      maxWidthClass="max-w-xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="inviteName"
          label={LABELS_ADMIN_USERS_PAGE.inviteModal.fields.name.label}
          placeholder={
            LABELS_ADMIN_USERS_PAGE.inviteModal.fields.name.placeholder
          }
          icon={HiUser}
          registration={register("name", {
            required: LABELS_ADMIN_USERS_PAGE.validation.nameRequired,
          })}
          error={errors.name?.message}
        />

        <FormField
          id="inviteEmail"
          type="email"
          label={LABELS_ADMIN_USERS_PAGE.inviteModal.fields.email.label}
          placeholder={
            LABELS_ADMIN_USERS_PAGE.inviteModal.fields.email.placeholder
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

        {isAdmin ? (
          <>
            <div className="space-y-2">
              <label
                htmlFor="inviteCompany"
                className="block text-sm font-semibold text-foreground"
              >
                {LABELS_ADMIN_USERS_PAGE.inviteModal.fields.company.label}
              </label>
              <div className="flex items-center rounded-xl border border-border bg-card px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <HiBuildingOffice2 className="shrink-0 text-lg text-muted-foreground" />
                <select
                  id="inviteCompany"
                  className="w-full border-none bg-transparent px-2 py-3 text-sm text-foreground outline-none"
                  {...register("companyId", {
                    required: LABELS_ADMIN_USERS_PAGE.validation.companyRequired,
                  })}
                >
                  <option value="">
                    {
                      LABELS_ADMIN_USERS_PAGE.inviteModal.fields.company
                        .placeholder
                    }
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.companyId?.message ? (
                <p className="text-xs font-medium text-destructive">
                  {errors.companyId.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="inviteRole"
                className="block text-sm font-semibold text-foreground"
              >
                {LABELS_ADMIN_USERS_PAGE.inviteModal.fields.role.label}
              </label>
              <div className="flex items-center rounded-xl border border-border bg-card px-3 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <HiIdentification className="shrink-0 text-lg text-muted-foreground" />
                <select
                  id="inviteRole"
                  className="w-full border-none bg-transparent px-2 py-3 text-sm text-foreground outline-none"
                  {...register("role", {
                    required: LABELS_ADMIN_USERS_PAGE.validation.roleRequired,
                  })}
                >
                  <option value="business">
                    {LABELS_ADMIN_USERS_PAGE.roles.business}
                  </option>
                  <option value="common">
                    {LABELS_ADMIN_USERS_PAGE.roles.common}
                  </option>
                </select>
              </div>
            </div>
          </>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {LABELS_ADMIN_USERS_PAGE.inviteModal.cancel}
          </button>
          <button
            type="submit"
            disabled={createInvitation.isPending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {createInvitation.isPending
              ? LABELS_ADMIN_USERS_PAGE.inviteModal.submitting
              : LABELS_ADMIN_USERS_PAGE.inviteModal.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InviteUserModal;

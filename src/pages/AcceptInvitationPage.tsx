import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { HiLockClosed, HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { FormField, FormSubmitButton } from "../shared/components/forms";
import { LABELS_ACCEPT_INVITATION, PATHS } from "../shared/data";
import { useAcceptInvitation } from "../shared/hooks";

type AcceptFormValues = {
  password: string;
  confirmPassword: string;
  mobilePhone: string;
};

const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const navigate = useNavigate();
  const acceptInvitation = useAcceptInvitation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
      mobilePhone: "",
    },
    mode: "onBlur",
  });

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<AcceptFormValues> = (values) => {
    if (!token) {
      return;
    }

    acceptInvitation.mutate(
      {
        token,
        password: values.password,
        mobilePhone: values.mobilePhone.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || LABELS_ACCEPT_INVITATION.successRedirect);
          navigate(PATHS.LOGIN, { replace: true });
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
          <section className="w-full rounded-[22px] border border-border bg-card px-5 py-8 text-center sm:px-8">
            <p className="text-sm text-destructive">
              {LABELS_ACCEPT_INVITATION.missingToken}
            </p>
            <Link
              to={PATHS.LOGIN}
              className="mt-6 inline-block text-sm font-semibold text-primary"
            >
              {LABELS_ACCEPT_INVITATION.goToLogin}
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
        <section className="w-full rounded-[22px] border border-border bg-card px-5 py-8 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-2xl text-primary-foreground">
              <HiOutlineClipboardDocumentList />
            </div>
            <h1 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.03em] text-foreground">
              {LABELS_ACCEPT_INVITATION.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {LABELS_ACCEPT_INVITATION.description}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              id="invitePassword"
              type={showPassword ? "text" : "password"}
              label={LABELS_ACCEPT_INVITATION.fields.password.label}
              placeholder={LABELS_ACCEPT_INVITATION.fields.password.placeholder}
              icon={HiLockClosed}
              autoComplete="new-password"
              registration={register("password", {
                required: LABELS_ACCEPT_INVITATION.fields.password.required,
                minLength: {
                  value: 8,
                  message: LABELS_ACCEPT_INVITATION.fields.password.min,
                },
              })}
              error={errors.password?.message}
            />

            <FormField
              id="inviteConfirmPassword"
              type={showPassword ? "text" : "password"}
              label={LABELS_ACCEPT_INVITATION.fields.confirmPassword.label}
              placeholder={
                LABELS_ACCEPT_INVITATION.fields.confirmPassword.placeholder
              }
              icon={HiLockClosed}
              autoComplete="new-password"
              registration={register("confirmPassword", {
                required:
                  LABELS_ACCEPT_INVITATION.fields.confirmPassword.required,
                validate: (value) =>
                  value === passwordValue ||
                  LABELS_ACCEPT_INVITATION.fields.confirmPassword.mismatch,
              })}
              error={errors.confirmPassword?.message}
            />

            <FormField
              id="invitePhone"
              type="tel"
              label={LABELS_ACCEPT_INVITATION.fields.phone.label}
              placeholder={LABELS_ACCEPT_INVITATION.fields.phone.placeholder}
              icon={HiDevicePhoneMobile}
              registration={register("mobilePhone")}
            />

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded border-border"
              />
              {LABELS_ACCEPT_INVITATION.showPassword}
            </label>

            <FormSubmitButton
              isLoading={acceptInvitation.isPending}
              label={
                acceptInvitation.isPending
                  ? LABELS_ACCEPT_INVITATION.submitting
                  : LABELS_ACCEPT_INVITATION.submit
              }
            />
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to={PATHS.LOGIN} className="font-semibold text-primary">
              {LABELS_ACCEPT_INVITATION.goToLogin}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default AcceptInvitationPage;

import { useState } from "react";
import {
  HiArrowRight,
  HiGlobeAlt,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { useForm, type SubmitHandler } from "react-hook-form";
import { HiLockClosed, HiOutlineEnvelope } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { FormField, FormSubmitButton } from "../shared/components/forms";
import { LABELS_LOGIN, PATHS } from "../shared/data";
import useAuthStore from "../shared/store/useAuthStore";
import { getRoleHome } from "../shared/utils";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      clearError();
      await login(values.email, values.password);
      const role = useAuthStore.getState().user?.role;
      navigate(getRoleHome(role));
    } catch (error) {
      // El error ya está en el store
      void error;
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
        <section className="w-full rounded-[22px] border border-border bg-card px-5 py-8 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-2xl text-primary-foreground">
              <HiOutlineClipboardDocumentList />
            </div>

            <h1 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.03em] text-foreground">
              {LABELS_LOGIN.title}
            </h1>

            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {LABELS_LOGIN.description}
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              id="email"
              type="email"
              label={LABELS_LOGIN.labelEmail}
              placeholder={LABELS_LOGIN.placeholderEmail}
              icon={HiOutlineEnvelope}
              autoComplete="email"
              registration={register("email", {
                required: LABELS_LOGIN.requiredField.email,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: LABELS_LOGIN.errorField.email,
                },
              })}
              error={errors.email?.message}
            />

            <FormField
              id="password"
              type={showPassword ? "text" : "password"}
              label={LABELS_LOGIN.labelPassword}
              placeholder={LABELS_LOGIN.placeholderPassword}
              icon={HiLockClosed}
              autoComplete="current-password"
              registration={register("password", {
                required: LABELS_LOGIN.requiredField.password,
                minLength: {
                  value: 8,
                  message: LABELS_LOGIN.errorField.password,
                },
              })}
              error={errors.password?.message}
              passwordToggle={{
                visible: showPassword,
                onToggle: () => setShowPassword((prev) => !prev),
                showLabel: LABELS_LOGIN.showPassword,
                hideLabel: LABELS_LOGIN.hidePassword,
              }}
            />

            {authError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {authError}
              </div>
            )}

            <div className="flex items-center justify-end gap-4 text-sm">
              <button
                type="button"
                onClick={() => navigate(PATHS.RECOVER_PASSWORD)}
                className="font-medium text-primary transition hover:text-primary"
              >
                {LABELS_LOGIN.forgotPassword}
              </button>
            </div>

            <FormSubmitButton
              label={LABELS_LOGIN.submitButton}
              isLoading={isSubmitting}
              icon={<HiArrowRight className="text-base" />}
            />
          </form>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <HiGlobeAlt className="text-base text-muted-foreground" />
            <span>{LABELS_LOGIN.footer}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

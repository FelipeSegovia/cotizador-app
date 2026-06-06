import { useState } from "react";
import {
  HiArrowLeft,
  HiArrowRight,
  HiGlobeAlt,
  HiLockClosed,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineKey,
} from "react-icons/hi2";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { FormField, FormSubmitButton } from "../shared/components/forms";
import { LABELS_LOGIN, LABELS_RECOVER_PASSWORD, PATHS } from "../shared/data";
import {
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "../shared/services";

type EmailFormValues = { email: string };
type CodeFormValues = { code: string };
type PasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);

  const emailForm = useForm<EmailFormValues>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const codeForm = useForm<CodeFormValues>({
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const onEmailSubmit: SubmitHandler<EmailFormValues> = async (values) => {
    try {
      setApiError(null);
      await forgotPassword({ email: values.email.trim() });
      setEmail(values.email.trim());
      setStep(2);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setApiError(message);
    }
  };

  const onCodeSubmit: SubmitHandler<CodeFormValues> = async (values) => {
    try {
      setApiError(null);
      await verifyResetCode({ email, code: values.code.trim() });
      setCode(values.code.trim());
      setStep(3);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setApiError(message);
    }
  };

  const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (values) => {
    try {
      setApiError(null);
      await resetPassword({
        email,
        code,
        newPassword: values.newPassword,
      });
      toast.success(LABELS_RECOVER_PASSWORD.step3.success);
      navigate(PATHS.LOGIN);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      setApiError(message);
    }
  };

  const stepConfig = {
    1: LABELS_RECOVER_PASSWORD.step1,
    2: LABELS_RECOVER_PASSWORD.step2,
    3: LABELS_RECOVER_PASSWORD.step3,
  }[step];

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
        <section className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#65efbe] text-2xl text-emerald-900 shadow-[0_10px_25px_rgba(101,239,190,0.35)]">
              <HiOutlineClipboardDocumentList />
            </div>

            <h1 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.03em] text-slate-900">
              {stepConfig.title}
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500">
              {stepConfig.description}
            </p>
          </div>

          {step === 1 && (
            <form
              className="mt-8 space-y-5"
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              noValidate
            >
              <FormField
                id="email"
                type="email"
                label={LABELS_RECOVER_PASSWORD.step1.labelEmail}
                placeholder={LABELS_RECOVER_PASSWORD.step1.placeholderEmail}
                icon={HiOutlineEnvelope}
                autoComplete="email"
                registration={emailForm.register("email", {
                  required: LABELS_RECOVER_PASSWORD.requiredField.email,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: LABELS_RECOVER_PASSWORD.errorField.email,
                  },
                })}
                error={emailForm.formState.errors.email?.message}
              />

              {apiError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <FormSubmitButton
                label={LABELS_RECOVER_PASSWORD.step1.submitButton}
                isLoading={emailForm.formState.isSubmitting}
                icon={<HiArrowRight className="text-base" />}
              />
            </form>
          )}

          {step === 2 && (
            <form
              className="mt-8 space-y-5"
              onSubmit={codeForm.handleSubmit(onCodeSubmit)}
              noValidate
            >
              <FormField
                id="code"
                type="text"
                inputMode="numeric"
                label={LABELS_RECOVER_PASSWORD.step2.labelCode}
                placeholder={LABELS_RECOVER_PASSWORD.step2.placeholderCode}
                icon={HiOutlineKey}
                autoComplete="one-time-code"
                registration={codeForm.register("code", {
                  required: LABELS_RECOVER_PASSWORD.requiredField.code,
                  pattern: {
                    value: /^\d{6}$/,
                    message: LABELS_RECOVER_PASSWORD.errorField.code,
                  },
                })}
                error={codeForm.formState.errors.code?.message}
              />

              {apiError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <FormSubmitButton
                label={LABELS_RECOVER_PASSWORD.step2.submitButton}
                isLoading={codeForm.formState.isSubmitting}
                icon={<HiArrowRight className="text-base" />}
              />
            </form>
          )}

          {step === 3 && (
            <form
              className="mt-8 space-y-5"
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              noValidate
            >
              <FormField
                id="newPassword"
                type="password"
                label={LABELS_RECOVER_PASSWORD.step3.labelNewPassword}
                placeholder={LABELS_RECOVER_PASSWORD.step3.placeholderPassword}
                icon={HiLockClosed}
                autoComplete="new-password"
                registration={passwordForm.register("newPassword", {
                  required: LABELS_RECOVER_PASSWORD.requiredField.password,
                  minLength: {
                    value: 8,
                    message: LABELS_RECOVER_PASSWORD.errorField.password,
                  },
                })}
                error={passwordForm.formState.errors.newPassword?.message}
              />

              <FormField
                id="confirmPassword"
                type="password"
                label={LABELS_RECOVER_PASSWORD.step3.labelConfirmPassword}
                placeholder={LABELS_RECOVER_PASSWORD.step3.placeholderPassword}
                icon={HiLockClosed}
                autoComplete="new-password"
                registration={passwordForm.register("confirmPassword", {
                  required:
                    LABELS_RECOVER_PASSWORD.requiredField.confirmPassword,
                  validate: (value, formValues) =>
                    value === formValues.newPassword ||
                    LABELS_RECOVER_PASSWORD.errorField.mismatch,
                })}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />

              {apiError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {apiError}
                </div>
              )}

              <FormSubmitButton
                label={LABELS_RECOVER_PASSWORD.step3.submitButton}
                isLoading={passwordForm.formState.isSubmitting}
                icon={<HiArrowRight className="text-base" />}
              />
            </form>
          )}

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => navigate(PATHS.LOGIN)}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
            >
              <HiArrowLeft className="text-base" />
              {LABELS_RECOVER_PASSWORD.backToLogin}
            </button>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <HiGlobeAlt className="text-base text-slate-400" />
            <span>{LABELS_LOGIN.footer}</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RecoverPasswordPage;

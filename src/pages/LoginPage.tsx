import {
  HiArrowRight,
  HiGlobeAlt,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { useForm, type SubmitHandler } from "react-hook-form";
import { HiLockClosed, HiOutlineEnvelope } from "react-icons/hi2";
import { FormField, FormSubmitButton } from "../shared/components/forms";
import { LABELS_LOGIN } from "../shared/data";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
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
    void values;
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
        <section className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#65efbe] text-2xl text-emerald-900 shadow-[0_10px_25px_rgba(101,239,190,0.35)]">
              <HiOutlineClipboardDocumentList />
            </div>

            <h1 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.03em] text-slate-900">
              {LABELS_LOGIN.title}
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500">
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
              type="password"
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
            />

            <div className="flex items-center justify-end gap-4 text-sm">
              <button
                type="button"
                className="font-medium text-emerald-700 transition hover:text-emerald-800"
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

export default LoginPage;

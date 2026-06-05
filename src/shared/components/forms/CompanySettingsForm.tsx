import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiBuildingOffice2, HiMapPin, HiPhoto } from "react-icons/hi2";
import { LABELS_SETTINGS_PAGE } from "../../data";
import { useCompany } from "../../hooks";
import { saveCompany } from "../../services";
import type { CompanyWriteDto } from "../../types/company";
import { formatRutAsYouType, stripRutForApi } from "../../utils";
import { SectionCard } from "../ui";
import FormField from "./FormField";

type CompanyFormValues = CompanyWriteDto;

const EMPTY_COMPANY_FORM: CompanyFormValues = {
  name: "",
  rut: "",
  address: "",
  city: "",
  contact: "",
};

const ACCEPTED_LOGO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/svg+xml",
]);

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

const companyInitialsFromName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "—";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
};

const CompanySettingsForm = () => {
  const queryClient = useQueryClient();
  const companyQuery = useCompany();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    defaultValues: EMPTY_COMPANY_FORM,
  });

  useEffect(() => {
    if (companyQuery.isPending) {
      return;
    }

    const company = companyQuery.data;
    if (company) {
      reset({
        name: company.name,
        rut: formatRutAsYouType(stripRutForApi(company.rut)),
        address: company.address ?? "",
        city: company.city ?? "",
        contact: company.contact ?? "",
      });
    } else {
      reset(EMPTY_COMPANY_FORM);
    }
  }, [companyQuery.isPending, companyQuery.data, reset]);

  useEffect(() => {
    return () => {
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    };
  }, [logoPreviewUrl]);

  const saveMutation = useMutation({
    mutationFn: ({
      payload,
      logo,
    }: {
      payload: CompanyWriteDto;
      logo: File | null;
    }) => saveCompany(payload, logo),
    onSuccess: (saved) => {
      queryClient.setQueryData(["company"], saved);
      reset({
        name: saved.name,
        rut: formatRutAsYouType(stripRutForApi(saved.rut)),
        address: saved.address ?? "",
        city: saved.city ?? "",
        contact: saved.contact ?? "",
      });
      if (logoPreviewUrl) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
      setLogoFile(null);
      setLogoPreviewUrl(null);
      setLogoError(null);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
      setSaveMessage(LABELS_SETTINGS_PAGE.companyCard.saveSuccess);
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

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!ACCEPTED_LOGO_MIME_TYPES.has(file.type)) {
      setLogoError(LABELS_SETTINGS_PAGE.companyCard.fields.logo.invalidType);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setLogoError(LABELS_SETTINGS_PAGE.companyCard.fields.logo.maxSize);
      event.target.value = "";
      return;
    }

    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }

    setLogoError(null);
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = (data: CompanyFormValues) => {
    if (logoError) {
      return;
    }

    setSaveMessage(null);
    saveMutation.mutate({
      payload: {
        name: data.name.trim(),
        rut: data.rut,
        address: data.address?.trim() ?? "",
        city: data.city?.trim() ?? "",
        contact: data.contact?.trim() ?? "",
      },
      logo: logoFile,
    });
  };

  const company = companyQuery.data;
  const companyName = company?.name?.trim() ?? "";
  const displayedLogoUrl = logoPreviewUrl ?? company?.logoUrl ?? null;
  const hasLogo = Boolean(displayedLogoUrl);

  return (
    <SectionCard
      title={LABELS_SETTINGS_PAGE.companyCard.title}
      icon={HiBuildingOffice2}
    >
      {companyQuery.isPending ? (
        <p className="text-sm text-slate-500">
          {LABELS_SETTINGS_PAGE.loadingCompany}
        </p>
      ) : null}

      {companyQuery.isError ? (
        <p className="mb-4 text-sm text-rose-600">
          {LABELS_SETTINGS_PAGE.companyCard.loadError}
        </p>
      ) : null}

      {!companyQuery.isPending ? (
        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {LABELS_SETTINGS_PAGE.companyCard.fields.logo.label}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                {hasLogo ? (
                  <img
                    src={displayedLogoUrl!}
                    alt={LABELS_SETTINGS_PAGE.companyCard.fields.logo.alt}
                    className="h-full w-full object-contain"
                  />
                ) : companyName ? (
                  <span className="text-sm font-black text-slate-700">
                    {companyInitialsFromName(companyName)}
                  </span>
                ) : (
                  <HiPhoto className="h-6 w-6 text-slate-400" aria-hidden />
                )}
              </div>
              <div className="space-y-2">
                <input
                  ref={logoInputRef}
                  id="companyLogo"
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  className="sr-only"
                  onChange={handleLogoChange}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {hasLogo
                    ? LABELS_SETTINGS_PAGE.companyCard.fields.logo.changeButton
                    : LABELS_SETTINGS_PAGE.companyCard.fields.logo.uploadButton}
                </button>
                <p className="text-xs text-slate-500">
                  {LABELS_SETTINGS_PAGE.companyCard.fields.logo.hint}
                </p>
                {logoError ? (
                  <p className="text-xs font-medium text-rose-600">{logoError}</p>
                ) : null}
              </div>
            </div>
          </div>

          <FormField
            id="companyName"
            label={LABELS_SETTINGS_PAGE.companyCard.fields.name.label}
            placeholder={
              LABELS_SETTINGS_PAGE.companyCard.fields.name.placeholder
            }
            registration={register("name", {
              required: LABELS_SETTINGS_PAGE.companyCard.fields.name.required,
            })}
            error={errors.name?.message}
          />

          <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
            <Controller
              control={control}
              name="rut"
              rules={{
                required: LABELS_SETTINGS_PAGE.companyCard.fields.rut.required,
                validate: (value) =>
                  stripRutForApi(value).length >= 2 ||
                  LABELS_SETTINGS_PAGE.companyCard.fields.rut.required,
              }}
              render={({ field, fieldState }) => (
                <FormField
                  id="companyRut"
                  label={LABELS_SETTINGS_PAGE.companyCard.fields.rut.label}
                  placeholder={
                    LABELS_SETTINGS_PAGE.companyCard.fields.rut.placeholder
                  }
                  value={field.value ?? ""}
                  registration={{
                    name: field.name,
                    onBlur: field.onBlur,
                    ref: field.ref,
                    onChange: (e: ChangeEvent<HTMLInputElement>) => {
                      field.onChange(formatRutAsYouType(e.target.value));
                    },
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />

            <div className="space-y-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                {LABELS_SETTINGS_PAGE.companyCard.ivaInfo.title}
              </p>
              <p className="text-xs leading-relaxed text-emerald-900/80">
                {LABELS_SETTINGS_PAGE.companyCard.ivaInfo.body}
              </p>
            </div>
          </div>

          <FormField
            id="companyAddress"
            label={LABELS_SETTINGS_PAGE.companyCard.fields.address.label}
            placeholder={
              LABELS_SETTINGS_PAGE.companyCard.fields.address.placeholder
            }
            icon={HiMapPin}
            registration={register("address")}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="companyCity"
              label={LABELS_SETTINGS_PAGE.companyCard.fields.city.label}
              placeholder={
                LABELS_SETTINGS_PAGE.companyCard.fields.city.placeholder
              }
              registration={register("city")}
            />
            <FormField
              id="companyContact"
              label={LABELS_SETTINGS_PAGE.companyCard.fields.contact.label}
              placeholder={
                LABELS_SETTINGS_PAGE.companyCard.fields.contact.placeholder
              }
              registration={register("contact")}
            />
          </div>

          <p className="text-xs italic text-slate-500">
            {LABELS_SETTINGS_PAGE.companyCard.footerNote}
          </p>

          {saveMutation.isError ? (
            <p className="text-sm font-medium text-rose-600">
              {(saveMutation.error as Error).message}
            </p>
          ) : null}

          {saveMessage ? (
            <p className="text-sm font-medium text-emerald-700">{saveMessage}</p>
          ) : null}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveMutation.isPending
                ? LABELS_SETTINGS_PAGE.companyCard.saving
                : LABELS_SETTINGS_PAGE.companyCard.saveButton}
            </button>
          </div>
        </form>
      ) : null}
    </SectionCard>
  );
};

export default CompanySettingsForm;

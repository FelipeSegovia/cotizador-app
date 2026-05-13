import { useEffect, useState, type ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiBuildingOffice2, HiMapPin } from "react-icons/hi2";
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

const CompanySettingsForm = () => {
  const queryClient = useQueryClient();
  const companyQuery = useCompany();
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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

  const saveMutation = useMutation({
    mutationFn: (payload: CompanyWriteDto) => saveCompany(payload),
    onSuccess: (saved) => {
      queryClient.setQueryData(["company"], saved);
      reset({
        name: saved.name,
        rut: formatRutAsYouType(stripRutForApi(saved.rut)),
        address: saved.address ?? "",
        city: saved.city ?? "",
        contact: saved.contact ?? "",
      });
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

  const onSubmit = (data: CompanyFormValues) => {
    setSaveMessage(null);
    saveMutation.mutate({
      name: data.name.trim(),
      rut: data.rut,
      address: data.address?.trim() ?? "",
      city: data.city?.trim() ?? "",
      contact: data.contact?.trim() ?? "",
    });
  };

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

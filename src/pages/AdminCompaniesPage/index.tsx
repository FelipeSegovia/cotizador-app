import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiMagnifyingGlass, HiPlus, HiUserPlus } from "react-icons/hi2";
import { toast } from "sonner";
import { FormField } from "../../shared/components/forms";
import { Alert, Modal } from "../../shared/components/ui";
import LABELS_ADMIN_COMPANIES_PAGE from "../../shared/data/labels-admin-companies-page";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import { useCompanies, useCreateCompany } from "../../shared/hooks/useCompanies";
import { useCreateInvitation } from "../../shared/hooks/useInvitations";
import type { Company, CompanyWriteDto } from "../../shared/types/company";
import { formatRutAsYouType, isMswEnabled, stripRutForApi } from "../../shared/utils";
import type { ChangeEvent } from "react";

type CreateCompanyFormValues = CompanyWriteDto;

type InviteOwnerFormValues = {
  name: string;
  email: string;
};

const AdminCompaniesPage = () => {
  const { data: companies = [], isLoading, isError } = useCompanies();
  const createCompany = useCreateCompany();
  const createInvitation = useCreateInvitation();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [inviteCompany, setInviteCompany] = useState<Company | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    control: createControl,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateCompanyFormValues>({
    defaultValues: {
      name: "",
      rut: "",
      address: "",
      city: "",
      contact: "",
    },
  });

  const {
    register: registerInvite,
    handleSubmit: handleSubmitInvite,
    reset: resetInvite,
    formState: { errors: inviteErrors },
  } = useForm<InviteOwnerFormValues>({
    defaultValues: { name: "", email: "" },
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return companies;
    }
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.rut.toLowerCase().includes(query) ||
        (company.city ?? "").toLowerCase().includes(query),
    );
  }, [companies, search]);

  const closeCreate = () => {
    resetCreate();
    setIsCreateOpen(false);
  };

  const closeInvite = () => {
    resetInvite();
    setInviteCompany(null);
  };

  const onCreate = (data: CreateCompanyFormValues) => {
    createCompany.mutate(
      {
        name: data.name.trim(),
        rut: stripRutForApi(data.rut),
        address: data.address?.trim() ?? "",
        city: data.city?.trim() ?? "",
        contact: data.contact?.trim() ?? "",
      },
      {
        onSuccess: () => {
          toast.success(LABELS_ADMIN_COMPANIES_PAGE.createModal.success);
          closeCreate();
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  const onInviteOwner = (data: InviteOwnerFormValues) => {
    if (!inviteCompany) {
      return;
    }

    createInvitation.mutate(
      {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        companyId: inviteCompany.id,
        role: "business",
      },
      {
        onSuccess: () => {
          toast.success(LABELS_ADMIN_COMPANIES_PAGE.inviteModal.success);
          if (isMswEnabled()) {
            toast.info(LABELS_ADMIN_USERS_PAGE.inviteModal.emailSimulated);
          }
          closeInvite();
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {LABELS_ADMIN_COMPANIES_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {LABELS_ADMIN_COMPANIES_PAGE.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <HiPlus className="text-base" />
          {LABELS_ADMIN_COMPANIES_PAGE.newButton}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {LABELS_ADMIN_COMPANIES_PAGE.title}
          </h2>
          <label className="relative w-full max-w-xs">
            <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={LABELS_ADMIN_COMPANIES_PAGE.searchPlaceholder}
              className="w-full rounded-xl border border-border bg-muted py-2 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:bg-card"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            {LABELS_ADMIN_COMPANIES_PAGE.loading}
          </div>
        ) : null}

        {isError ? (
          <div className="p-6">
            <Alert variant="error">
              {LABELS_ADMIN_COMPANIES_PAGE.loadError}
            </Alert>
          </div>
        ) : null}

        {!isLoading && !isError && filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            {LABELS_ADMIN_COMPANIES_PAGE.empty}
          </div>
        ) : null}

        {!isLoading && !isError && filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <th className="px-6 py-4">
                    {LABELS_ADMIN_COMPANIES_PAGE.table.name}
                  </th>
                  <th className="px-6 py-4">
                    {LABELS_ADMIN_COMPANIES_PAGE.table.rut}
                  </th>
                  <th className="px-6 py-4">
                    {LABELS_ADMIN_COMPANIES_PAGE.table.city}
                  </th>
                  <th className="px-6 py-4">
                    {LABELS_ADMIN_COMPANIES_PAGE.table.contact}
                  </th>
                  <th className="px-6 py-4">
                    {LABELS_ADMIN_COMPANIES_PAGE.table.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border transition hover:bg-muted/60"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {company.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {company.rut}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {company.city || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {company.contact || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        title={LABELS_ADMIN_COMPANIES_PAGE.table.invite}
                        onClick={() => setInviteCompany(company)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                      >
                        <HiUserPlus className="text-base" />
                        {LABELS_ADMIN_COMPANIES_PAGE.table.invite}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title={LABELS_ADMIN_COMPANIES_PAGE.createModal.title}
        subtitle={LABELS_ADMIN_COMPANIES_PAGE.createModal.subtitle}
        maxWidthClass="max-w-xl"
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmitCreate(onCreate)}
          noValidate
        >
          <FormField
            id="companyName"
            label="Razón social"
            registration={registerCreate("name", {
              required: LABELS_ADMIN_COMPANIES_PAGE.validation.nameRequired,
            })}
            error={createErrors.name?.message}
          />
          <Controller
            control={createControl}
            name="rut"
            rules={{
              required: LABELS_ADMIN_COMPANIES_PAGE.validation.rutRequired,
              validate: (value) =>
                stripRutForApi(value).length >= 2 ||
                LABELS_ADMIN_COMPANIES_PAGE.validation.rutRequired,
            }}
            render={({ field, fieldState }) => (
              <FormField
                id="companyRut"
                label="RUT"
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
          <FormField
            id="companyAddress"
            label="Dirección"
            registration={registerCreate("address")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="companyCity"
              label="Ciudad"
              registration={registerCreate("city")}
            />
            <FormField
              id="companyContact"
              label="Contacto"
              registration={registerCreate("contact")}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeCreate}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {LABELS_ADMIN_COMPANIES_PAGE.createModal.cancel}
            </button>
            <button
              type="submit"
              disabled={createCompany.isPending}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {createCompany.isPending
                ? LABELS_ADMIN_COMPANIES_PAGE.createModal.submitting
                : LABELS_ADMIN_COMPANIES_PAGE.createModal.submit}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(inviteCompany)}
        onClose={closeInvite}
        title={LABELS_ADMIN_COMPANIES_PAGE.inviteModal.title}
        subtitle={
          inviteCompany
            ? `${LABELS_ADMIN_COMPANIES_PAGE.inviteModal.subtitle}: ${inviteCompany.name}`
            : LABELS_ADMIN_COMPANIES_PAGE.inviteModal.subtitle
        }
        maxWidthClass="max-w-lg"
      >
        <form
          className="space-y-4"
          onSubmit={handleSubmitInvite(onInviteOwner)}
          noValidate
        >
          <FormField
            id="ownerName"
            label={LABELS_ADMIN_USERS_PAGE.inviteModal.fields.name.label}
            registration={registerInvite("name", {
              required: LABELS_ADMIN_USERS_PAGE.validation.nameRequired,
            })}
            error={inviteErrors.name?.message}
          />
          <FormField
            id="ownerEmail"
            type="email"
            label={LABELS_ADMIN_USERS_PAGE.inviteModal.fields.email.label}
            registration={registerInvite("email", {
              required: LABELS_ADMIN_USERS_PAGE.validation.emailRequired,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: LABELS_ADMIN_USERS_PAGE.validation.emailInvalid,
              },
            })}
            error={inviteErrors.email?.message}
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeInvite}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {LABELS_ADMIN_COMPANIES_PAGE.createModal.cancel}
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
    </div>
  );
};

export default AdminCompaniesPage;

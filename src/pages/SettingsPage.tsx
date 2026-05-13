import { useMemo } from "react";
import {
  HiDocumentText,
  HiOutlineClock,
  HiShieldCheck,
} from "react-icons/hi2";
import { LABELS_SETTINGS_PAGE } from "../shared/data";
import { useCompany } from "../shared/hooks";
import { CompanySettingsForm, PersonalProfileForm } from "../shared/components/forms";

const formatLongDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const SettingsPage = () => {
  const companyQuery = useCompany();

  const lastUpdateCopy = useMemo(() => {
    const company = companyQuery.data;
    if (!company) {
      return LABELS_SETTINGS_PAGE.infoTiles.lastUpdate.bodyPending;
    }
    return LABELS_SETTINGS_PAGE.infoTiles.lastUpdate.bodyWithDate.replace(
      "{date}",
      formatLongDate(company.updatedAt),
    );
  }, [companyQuery.data]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
            {LABELS_SETTINGS_PAGE.pageTitle}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            {LABELS_SETTINGS_PAGE.pageSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <PersonalProfileForm />
        <CompanySettingsForm />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <HiShieldCheck className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {LABELS_SETTINGS_PAGE.infoTiles.security.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {LABELS_SETTINGS_PAGE.infoTiles.security.body}
            </p>
          </div>
        </article>

        <article className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <HiOutlineClock className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {LABELS_SETTINGS_PAGE.infoTiles.lastUpdate.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {lastUpdateCopy}
            </p>
          </div>
        </article>

        <article className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
            <HiDocumentText className="text-xl" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {LABELS_SETTINGS_PAGE.infoTiles.pdf.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {LABELS_SETTINGS_PAGE.infoTiles.pdf.body}
            </p>
          </div>
        </article>
      </section>
    </>
  );
};

export default SettingsPage;

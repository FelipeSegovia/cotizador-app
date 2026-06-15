import { useMemo } from "react";
import { HiDocumentText, HiOutlineClock, HiShieldCheck } from "react-icons/hi2";
import { LABELS_SETTINGS_PAGE } from "../shared/data";
import { useCompany } from "../shared/hooks";
import {
  CompanySettingsForm,
  PersonalProfileForm,
  TermsSettingsForm,
} from "../shared/components/forms";
import { InfoTile } from "../shared/components/ui";

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

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="w-full lg:max-w-md lg:shrink-0">
          <PersonalProfileForm />
        </div>
        <div className="min-w-0 flex-1">
          <CompanySettingsForm />
        </div>
      </div>

      <div className="mt-8">
        <TermsSettingsForm />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <InfoTile
          icon={HiShieldCheck}
          title={LABELS_SETTINGS_PAGE.infoTiles.security.title}
          description={LABELS_SETTINGS_PAGE.infoTiles.security.body}
        />
        <InfoTile
          icon={HiOutlineClock}
          title={LABELS_SETTINGS_PAGE.infoTiles.lastUpdate.title}
          description={lastUpdateCopy}
        />
        <InfoTile
          icon={HiDocumentText}
          title={LABELS_SETTINGS_PAGE.infoTiles.pdf.title}
          description={LABELS_SETTINGS_PAGE.infoTiles.pdf.body}
        />
      </section>
    </>
  );
};

export default SettingsPage;

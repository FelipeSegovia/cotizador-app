import { useNavigate } from "react-router";
import { HiArrowLeft, HiBellAlert, HiWrenchScrewdriver } from "react-icons/hi2";
import { PATHS } from "../../data";

type WorkInProgressViewProps = {
  title: string;
  description: string;
  backButtonLabel: string;
  notifyButtonLabel: string;
};

const WorkInProgressView = ({
  title,
  description,
  backButtonLabel,
  notifyButtonLabel,
}: WorkInProgressViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-6">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10">
        <div className="mx-auto flex h-22 w-22 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <HiWrenchScrewdriver className="text-4xl" />
        </div>

        <h1 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
          {title}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(PATHS.DASHBOARD)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <HiArrowLeft className="text-lg" />
            {backButtonLabel}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-muted-foreground transition hover:border-ring hover:text-foreground"
          >
            <HiBellAlert className="text-lg" />
            {notifyButtonLabel}
          </button>
        </div>
      </section>
    </div>
  );
};

export default WorkInProgressView;

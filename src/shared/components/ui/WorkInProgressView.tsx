import { useNavigate } from "react-router";
import { HiArrowLeft, HiBellAlert, HiWrenchScrewdriver } from "react-icons/hi2";

type WorkInProgressViewProps = {
  description: string;
};

const WorkInProgressView = ({ description }: WorkInProgressViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-6">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
        <div className="mx-auto flex h-22 w-22 items-center justify-center rounded-full bg-emerald-200 text-emerald-800">
          <HiWrenchScrewdriver className="text-4xl" />
        </div>

        <h1 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-5xl">
          Estamos trabajando en esta funcion
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
          {description}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <HiArrowLeft className="text-lg" />
            Volver al Dashboard
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-700"
          >
            <HiBellAlert className="text-lg" />
            Notificarme al finalizar
          </button>
        </div>
      </section>
    </div>
  );
};

export default WorkInProgressView;

import {
  HiCheckCircle,
  HiClipboardDocumentList,
  HiSparkles,
  HiUsers,
} from "react-icons/hi2";

const RootPage = () => {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Bienvenido de nuevo, QuoteFlow Chile Operations.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:bg-emerald-800"
        >
          <HiSparkles className="text-base" />
          Nueva Cotizacion
        </button>
      </div>

      <section className="mt-7 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <HiClipboardDocumentList className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Total Quoted (30 days)
          </p>
          <p className="mt-1 text-4xl font-black tracking-[-0.03em] text-slate-900">
            $14.250.000
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <HiUsers className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Pending Quotes
          </p>
          <p className="mt-1 text-4xl font-black tracking-[-0.03em] text-slate-900">
            24
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <HiCheckCircle className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Accepted Quotes
          </p>
          <p className="mt-1 text-4xl font-black tracking-[-0.03em] text-slate-900">
            18
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold tracking-[-0.03em] text-slate-900">
              Cotizaciones Recientes
            </h3>
            <button
              type="button"
              className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Ver Todo
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.07em] text-slate-500">
                <tr>
                  <th className="pb-1 pr-3">Cliente</th>
                  <th className="pb-1 pr-3">Fecha</th>
                  <th className="pb-1 pr-3">Monto (CLP)</th>
                  <th className="pb-1 pr-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="rounded-xl bg-slate-50 text-slate-700">
                  <td className="rounded-l-xl px-3 py-2.5 font-medium">
                    Sodimac S.A.
                  </td>
                  <td className="px-3 py-2.5">24 Oct 2023</td>
                  <td className="px-3 py-2.5">$2.450.000</td>
                  <td className="rounded-r-xl px-3 py-2.5">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      Accepted
                    </span>
                  </td>
                </tr>
                <tr className="rounded-xl bg-slate-50 text-slate-700">
                  <td className="rounded-l-xl px-3 py-2.5 font-medium">
                    CCU Chile
                  </td>
                  <td className="px-3 py-2.5">22 Oct 2023</td>
                  <td className="px-3 py-2.5">$850.000</td>
                  <td className="rounded-r-xl px-3 py-2.5">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      Sent
                    </span>
                  </td>
                </tr>
                <tr className="rounded-xl bg-slate-50 text-slate-700">
                  <td className="rounded-l-xl px-3 py-2.5 font-medium">
                    LATAM Airlines
                  </td>
                  <td className="px-3 py-2.5">21 Oct 2023</td>
                  <td className="px-3 py-2.5">$5.120.000</td>
                  <td className="rounded-r-xl px-3 py-2.5">
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      Draft
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl bg-[#0f2648] p-5 text-slate-100 shadow-[0_15px_45px_rgba(15,38,72,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">
              Tasa de conversion
            </p>
            <p className="mt-2 text-5xl font-black tracking-[-0.03em]">75%</p>
            <p className="mt-2 text-sm font-medium text-emerald-300">
              +5% vs mes anterior
            </p>
            <div className="mt-4 h-2 rounded-full bg-slate-700">
              <div className="h-2 w-3/4 rounded-full bg-emerald-400" />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900">
              Actividad Reciente
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Cotizacion #4592 aceptada</li>
              <li>Nueva cotizacion enviada a CCU</li>
              <li>Borrador creado para Walmart Chile</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
};

export default RootPage;

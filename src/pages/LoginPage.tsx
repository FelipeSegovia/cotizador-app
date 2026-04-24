import {
  HiArrowRight,
  HiGlobeAlt,
  HiLockClosed,
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
} from "react-icons/hi2";

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center">
        <section className="w-full rounded-[22px] border border-slate-200 bg-white px-5 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#65efbe] text-2xl text-emerald-900 shadow-[0_10px_25px_rgba(101,239,190,0.35)]">
              <HiOutlineClipboardDocumentList />
            </div>

            <h1 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.03em] text-slate-900">
              Bienvenido
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Sitio de cotizaciones para NeuralCode
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-slate-700"
                htmlFor="email"
              >
                Correo electrónico
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <HiOutlineEnvelope className="shrink-0 text-lg text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nombre@empresa.cl"
                  className="w-full border-none bg-transparent px-2 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-slate-700"
                htmlFor="password"
              >
                Contraseña
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
                <HiLockClosed className="shrink-0 text-lg text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••"
                  className="w-full border-none bg-transparent px-2 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 text-sm">
              <button
                type="button"
                className="font-medium text-emerald-700 transition hover:text-emerald-800"
              >
                ¿Olvidé mi contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a4a] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,122,74,0.25)] transition hover:bg-[#0c6a40]"
            >
              Iniciar sesión
              <HiArrowRight className="text-base" />
            </button>
          </form>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <HiGlobeAlt className="text-base text-slate-400" />
            <span>Soluciones digitales en todo Chile</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

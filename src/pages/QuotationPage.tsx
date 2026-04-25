import { useEffect, useRef } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  HiOutlineClipboardDocument,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineTableCells,
  HiOutlineTrash,
  HiOutlineUser,
  HiPlusCircle,
} from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { FormField, FormTextareaField } from "../shared/components/forms";
import { SectionCard } from "../shared/components/ui";
import { useQuotationDraftStore } from "../shared/store";
import type { QuotationFormData } from "../shared/types/quotation";

const IVA_RATE = 0.19;

const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

const QuotationPage = () => {
  const { draft, setDraft, setPreviewMode } = useQuotationDraftStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuotationFormData>({
    defaultValues: {
      items: [{ description: "", unitPrice: 0, quantity: 1 }],
    },
  });

  const initialDraft = useRef(draft);

  useEffect(() => {
    if (initialDraft.current !== null) {
      reset(initialDraft.current);
    }
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" }) ?? [];

  const subtotal = watchedItems.reduce(
    (sum, item) =>
      sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  const onSubmit = (data: QuotationFormData) => {
    setDraft(data);
    setPreviewMode(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>Cotizaciones</span>
            <span>/</span>
            <span className="font-medium text-slate-700">Crear Nueva</span>
          </nav>
          <h1 className="mt-0.5 text-2xl font-bold text-slate-800">
            Generador
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Descartar Borrador
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <HiOutlineEye className="text-base" />
            Guardar y Previsualizar
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-0 flex-1 space-y-6"
        >
          {/* Client Information */}
          <SectionCard title="Información del Cliente" icon={HiOutlineUser}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="clientName"
                  label="Nombre"
                  placeholder="ej. Constructora Andes S.A."
                  registration={register("clientName", {
                    required: "El nombre del cliente es obligatorio",
                  })}
                  error={errors.clientName?.message}
                />
                <FormField
                  id="clientRut"
                  label="RUT"
                  placeholder="76.123.456-K"
                  registration={register("clientRut", {
                    required: "El RUT es obligatorio",
                  })}
                  error={errors.clientRut?.message}
                />
              </div>
              <FormField
                id="clientEmail"
                label="Email"
                type="email"
                placeholder="facturacion@constructoraandes.cl"
                registration={register("clientEmail", {
                  required: "El email es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresa un email válido",
                  },
                })}
                error={errors.clientEmail?.message}
              />
            </div>
          </SectionCard>

          {/* Project Details */}
          <SectionCard
            title="Detalles del Proyecto"
            icon={HiOutlineClipboardDocument}
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="projectTitle"
                  label="Nombre del Proyecto"
                  placeholder="Renovación Interior - Fase 1"
                  registration={register("projectTitle", {
                    required: "El nombre del proyecto es obligatorio",
                  })}
                  error={errors.projectTitle?.message}
                />
                <FormField
                  id="projectDeadline"
                  label="Fecha Estimada de Entrega"
                  type="date"
                  registration={register("projectDeadline")}
                />
              </div>
              <FormTextareaField
                id="projectNotes"
                label="Descripción / Notas Internas"
                rows={4}
                placeholder="Detalles adicionales sobre el alcance del trabajo..."
                registration={register("projectNotes")}
              />
            </div>
          </SectionCard>

          {/* Itemized List */}
          <SectionCard
            title="Lista de Ítems"
            icon={HiOutlineTableCells}
            action={
              <button
                type="button"
                onClick={() =>
                  append({ description: "", unitPrice: 0, quantity: 1 })
                }
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                <HiPlusCircle className="text-base" />
                Agregar Ítem
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-130">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-600">
                    <th className="pb-3 pr-4">Descripción</th>
                    <th className="pb-3 pr-4 text-right">Precio Unitario</th>
                    <th className="pb-3 pr-4 text-right">Cantidad</th>
                    <th className="pb-3 pr-4 text-right">Total</th>
                    <th className="w-10 pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map((field, index) => {
                    const unitPrice =
                      Number(watchedItems[index]?.unitPrice) || 0;
                    const quantity = Number(watchedItems[index]?.quantity) || 0;
                    const rowTotal = unitPrice * quantity;

                    return (
                      <tr key={field.id} className="group">
                        <td className="py-3 pr-4">
                          <input
                            type="text"
                            placeholder="Descripción del servicio"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-100"
                            {...register(`items.${index}.description`, {
                              required: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={0}
                            placeholder="0"
                            className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-100"
                            {...register(`items.${index}.unitPrice`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={1}
                            placeholder="1"
                            className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-100"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right text-sm font-bold text-slate-800">
                          {formatCLP(rowTotal)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                            aria-label="Eliminar ítem"
                            className="text-slate-300 transition hover:text-red-500 disabled:pointer-events-none disabled:opacity-30"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </form>

        {/* Sidebar */}
        <aside className="w-full space-y-4 lg:w-80 lg:shrink-0">
          {/* Quote Summary */}
          <div className="rounded-2xl bg-[#1c2b3a] p-6 text-white">
            <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <HiOutlineDocumentText className="text-base" />
              Resumen de Cotización
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="font-medium text-white">
                  {formatCLP(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">IVA (19%)</span>
                <span className="font-medium text-white">{formatCLP(iva)}</span>
              </div>
              <div className="my-3 border-t border-slate-600" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Total Final
                </span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCLP(total)}
                </span>
              </div>
              <p className="text-right text-xs text-slate-500">
                Moneda: CLP (Peso Chileno)
              </p>
            </div>

            {/* Status */}
            <div className="mt-6 rounded-xl bg-slate-700/50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                Estado: Borrador
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-600">
                <div className="h-full w-2/3 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-xs italic text-slate-400">
                "Listo para revisión y aprobación"
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                <HiOutlineEye className="text-base" />
                Guardar y Previsualizar
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-500 bg-transparent py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                <MdOutlineEmail className="text-base" />
                Enviar al Cliente
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              Ayuda Rápida
            </h3>
            <ul className="space-y-2">
              {[
                "Los valores se calculan automáticamente en CLP.",
                "La validación del RUT se realiza al guardar.",
                "La vista previa en PDF se generará automáticamente.",
              ].map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs text-slate-600"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuotationPage;

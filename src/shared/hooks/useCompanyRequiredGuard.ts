import { useCallback, useMemo, useState } from "react";
import type { Company } from "../types/company";
import { useCompany } from "./useCompany";

const isCompanyValid = (company: Company | null | undefined): boolean => {
  if (!company) {
    return false;
  }
  return Boolean(company.name?.trim() && company.rut?.trim());
};

export const useCompanyRequiredGuard = () => {
  const { data: company, isLoading, isError } = useCompany();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCompanyConfigured = useMemo(() => isCompanyValid(company), [company]);

  const requireCompany = useCallback(
    (action: () => void) => {
      if (isLoading) {
        return;
      }

      // Si hubo un error de red, permitimos continuar para no bloquear al
      // usuario; el flujo posterior mostrará el error correspondiente.
      if (!isError && !isCompanyConfigured) {
        setIsModalOpen(true);
        return;
      }

      action();
    },
    [isLoading, isError, isCompanyConfigured],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isCompanyConfigured,
    isLoadingCompany: isLoading,
    requireCompany,
    companyRequiredModalProps: {
      isOpen: isModalOpen,
      onClose: closeModal,
    },
  };
};

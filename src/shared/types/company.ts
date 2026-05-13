export type Company = {
  id: string;
  name: string;
  rut: string;
  address: string;
  city: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
};

/** Cuerpo de PUT /api/company (mismo shape que persistido, sin id ni timestamps). */
export type CompanyWriteDto = {
  name: string;
  rut: string;
  address?: string;
  city?: string;
  contact?: string;
};

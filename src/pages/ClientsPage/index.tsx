import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import { toast } from "sonner";
import { Alert } from "../../shared/components/ui";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import {
  useClients,
  useDeleteClient,
  useUpdateClient,
} from "../../shared/hooks";
import type {
  Client,
  ClientContactChannel,
  ClientStatus,
} from "../../shared/types/client";
import ClientDetailModal from "./ClientDetailModal";
import ClientFilters, { type ClientStatusFilter } from "./ClientFilters";
import ClientStatsCards from "./ClientStatsCards";
import ClientsMobileList from "./ClientsMobileList";
import ClientsTable from "./ClientsTable";
import CreateClientModal from "./CreateClientModal";
import DeleteClientModal from "./DeleteClientModal";
import EditClientModal from "./EditClientModal";

const ClientsPage = () => {
  const { data: clients = [], isLoading, isError } = useClients();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatusFilter>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailClientId, setDetailClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients.filter((client) => {
      if (statusFilter !== "all" && client.status !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      const haystack = [
        client.name,
        client.email ?? "",
        client.phone ?? "",
        client.website ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [clients, search, statusFilter]);

  const detailClient = useMemo(
    () => clients.find((c) => c.id === detailClientId) ?? null,
    [clients, detailClientId],
  );

  const handleStatusChange = (client: Client, status: ClientStatus) => {
    if (status === client.status) return;
    setPendingId(client.id);
    updateClient.mutate(
      { id: client.id, payload: { status } },
      {
        onSuccess: () => {
          toast.success(LABELS_CLIENTS_PAGE.updateSuccess);
        },
        onError: (error) => {
          toast.error(
            (error as Error).message || LABELS_CLIENTS_PAGE.updateError,
          );
        },
        onSettled: () => {
          setPendingId(null);
        },
      },
    );
  };

  const handleChannelToggle = (
    client: Client,
    channel: ClientContactChannel,
    value: boolean,
  ) => {
    setPendingId(client.id);
    updateClient.mutate(
      { id: client.id, payload: { contacts: { [channel]: value } } },
      {
        onSuccess: () => {
          toast.success(LABELS_CLIENTS_PAGE.updateSuccess);
        },
        onError: (error) => {
          toast.error(
            (error as Error).message || LABELS_CLIENTS_PAGE.updateError,
          );
        },
        onSettled: () => {
          setPendingId(null);
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deletingClient) return;
    deleteClient.mutate(deletingClient.id, {
      onSuccess: () => {
        toast.success(LABELS_CLIENTS_PAGE.deleteModal.success);
        if (detailClientId === deletingClient.id) {
          setDetailClientId(null);
        }
        setDeletingClient(null);
      },
      onError: (error) => {
        toast.error((error as Error).message);
      },
    });
  };

  const handleEdit = (client: Client) => {
    setDetailClientId(null);
    setEditingClient(client);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {LABELS_CLIENTS_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {LABELS_CLIENTS_PAGE.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <HiPlus className="text-base" />
          {LABELS_CLIENTS_PAGE.addButton}
        </button>
      </div>

      {!isLoading && !isError && clients.length > 0 ? (
        <ClientStatsCards clients={clients} />
      ) : null}

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <HiMagnifyingGlass className="text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            {LABELS_CLIENTS_PAGE.title}
          </h2>
        </div>

        <ClientFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            {LABELS_CLIENTS_PAGE.loading}
          </div>
        ) : null}

        {isError ? (
          <div className="p-6">
            <Alert variant="error">{LABELS_CLIENTS_PAGE.loadError}</Alert>
          </div>
        ) : null}

        {!isLoading && !isError && filteredClients.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            {LABELS_CLIENTS_PAGE.empty}
          </div>
        ) : null}

        {!isLoading && !isError && filteredClients.length > 0 ? (
          <>
            <ClientsTable
              clients={filteredClients}
              totalCount={clients.length}
              pendingId={pendingId}
              onOpenDetail={(c) => setDetailClientId(c.id)}
              onStatusChange={handleStatusChange}
              onChannelToggle={handleChannelToggle}
              onEdit={handleEdit}
              onRequestDelete={setDeletingClient}
            />
            <ClientsMobileList
              clients={filteredClients}
              pendingId={pendingId}
              onOpenDetail={(c) => setDetailClientId(c.id)}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onRequestDelete={setDeletingClient}
            />
          </>
        ) : null}
      </div>

      <CreateClientModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditClientModal
        client={editingClient}
        onClose={() => setEditingClient(null)}
      />
      <ClientDetailModal
        client={detailClient}
        onClose={() => setDetailClientId(null)}
        onEdit={handleEdit}
      />
      <DeleteClientModal
        client={deletingClient}
        isDeleting={deleteClient.isPending}
        onClose={() => setDeletingClient(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ClientsPage;

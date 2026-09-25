import { useEffect, useMemo, useState } from "react";
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
import ClientsPagination from "./ClientsPagination";
import ClientsTable from "./ClientsTable";
import { clientMatchesSearch } from "./client-utils";
import CreateClientModal from "./CreateClientModal";
import DeleteClientModal from "./DeleteClientModal";
import EditClientModal from "./EditClientModal";

const CLIENTS_PAGE_SIZE = 5;

const ClientsPage = () => {
  const { data: clients = [], isLoading, isError } = useClients();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatusFilter>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailClientId, setDetailClientId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    clients.forEach((client) => {
      client.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [clients]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (statusFilter !== "all" && client.status !== statusFilter) {
        return false;
      }
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => client.tags.includes(tag))
      ) {
        return false;
      }
      return clientMatchesSearch(client, search);
    });
  }, [clients, search, statusFilter, selectedTags]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredClients.length / CLIENTS_PAGE_SIZE),
  );

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, selectedTags]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageClients = useMemo(() => {
    const start = (page - 1) * CLIENTS_PAGE_SIZE;
    return filteredClients.slice(start, start + CLIENTS_PAGE_SIZE);
  }, [filteredClients, page]);

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
          availableTags={availableTags}
          selectedTags={selectedTags}
          onSelectedTagsChange={setSelectedTags}
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
              clients={pageClients}
              pendingId={pendingId}
              onOpenDetail={(c) => setDetailClientId(c.id)}
              onStatusChange={handleStatusChange}
              onChannelToggle={handleChannelToggle}
              onEdit={handleEdit}
              onRequestDelete={setDeletingClient}
            />
            <ClientsMobileList
              clients={pageClients}
              pendingId={pendingId}
              onOpenDetail={(c) => setDetailClientId(c.id)}
              onStatusChange={handleStatusChange}
              onEdit={handleEdit}
              onRequestDelete={setDeletingClient}
            />
            <ClientsPagination
              page={page}
              pageSize={CLIENTS_PAGE_SIZE}
              total={filteredClients.length}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <CreateClientModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      {editingClient ? (
        <EditClientModal
          key={editingClient.id}
          client={editingClient}
          onClose={() => setEditingClient(null)}
        />
      ) : null}
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

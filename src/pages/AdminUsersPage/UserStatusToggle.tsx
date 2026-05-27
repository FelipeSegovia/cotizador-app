import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";

type UserStatusToggleProps = {
  isActive: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

const UserStatusToggle = ({
  isActive,
  disabled = false,
  onToggle,
}: UserStatusToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        disabled={disabled}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive ? "bg-emerald-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span
        className={`text-xs font-semibold ${
          isActive ? "text-emerald-700" : "text-slate-400"
        }`}
      >
        {isActive
          ? LABELS_ADMIN_USERS_PAGE.table.active
          : LABELS_ADMIN_USERS_PAGE.table.inactive}
      </span>
    </div>
  );
};

export default UserStatusToggle;

import { WorkInProgressView } from "../shared/components/ui";
import { LABELS_SETTINGS_PAGE } from "../shared/data";

const SettingsPage = () => {
  return (
    <WorkInProgressView
      title={LABELS_SETTINGS_PAGE.title}
      description={LABELS_SETTINGS_PAGE.description}
      backButtonLabel={LABELS_SETTINGS_PAGE.backButton}
      notifyButtonLabel={LABELS_SETTINGS_PAGE.notifyButton}
    />
  );
};

export default SettingsPage;

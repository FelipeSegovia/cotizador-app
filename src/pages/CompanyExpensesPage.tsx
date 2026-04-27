import { WorkInProgressView } from "../shared/components/ui";
import { LABELS_COMPANY_EXPENSES_PAGE } from "../shared/data";

const CompanyExpensesPage = () => {
  return (
    <WorkInProgressView
      title={LABELS_COMPANY_EXPENSES_PAGE.title}
      description={LABELS_COMPANY_EXPENSES_PAGE.description}
      backButtonLabel={LABELS_COMPANY_EXPENSES_PAGE.backButton}
      notifyButtonLabel={LABELS_COMPANY_EXPENSES_PAGE.notifyButton}
    />
  );
};

export default CompanyExpensesPage;

import { patientLeadsRepository } from "./patient-leads";

export const dashboardRepository = {
  getOverviewMetrics() {
    return patientLeadsRepository.getOverviewMetrics();
  },
};
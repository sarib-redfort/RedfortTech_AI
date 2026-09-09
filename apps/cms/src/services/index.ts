/**
 * Public surface of the API layer.
 *
 * Views import from `services/` rather than reaching into individual modules,
 * so resources can be split or regrouped without touching call sites.
 */
export { apiClient, toErrorMessage, toItem, toList, UNAUTHORIZED_EVENT } from '../lib/http';
export { authService, resolveCurrentUserId } from './auth';
export { contactService, dashboardService, profileService } from './misc';
export type { DashboardStats } from './misc';
export {
  blogService,
  caseStudyService,
  faqService,
  industryService,
  serviceService,
  teamMemberService,
  testimonialService,
  userService,
} from './resources';

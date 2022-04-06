import { Helper } from '@/utils';
import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/customer-leads', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'statusCareLatest.statusParentLead',
        'statusLeadLatest',
        'customerPotential.customerPotentialStatusCareLatest',
        'managerCall',
      ]),
    },
  });
}

export function getStatusLead() {
  return request(`/v1/status-parent-leads`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}

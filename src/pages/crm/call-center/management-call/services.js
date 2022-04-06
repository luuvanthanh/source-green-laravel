import { Helper } from '@/utils';
import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/manager-calls', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'customerLead',
        'customerLead.statusCareLatest.statusParentLead',
        'customerLead.statusLeadLatest',
        'customerLead.customerPotential.customerPotentialStatusCareLatest',
      ]),
    },
  });
}

export function getCountCall(params = {}) {
  return request(`/v1/count-call`, {
    method: 'GET',
    params: {
      ...params,
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

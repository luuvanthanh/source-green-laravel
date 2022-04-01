import { Helper } from '@/utils';
import request from '@/utils/requestCrm';

export function getExtensions(params = {}) {
  return request('/v1/extensions', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function checkPhoneNumber(data = {}) {
  return request(`/v1/customer-by-phone/${data.id}`, {
    method: 'GET',
    data,
    params: {
      include: Helper.convertIncludes([
        'statusCareLatest.statusParentLead',
        'statusLeadLatest',
        'customerPotential.customerPotentialStatusCareLatest.statusParentPotential',
      ]),
    },
  });
}

export function getParentLeadStatus(params = {}) {
  return request('/v1/status-parent-leads', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getParentPotentialsStatus(params = {}) {
  return request('/v1/status-parent-potentials', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getCrmId(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function addResultCall(data = {}) {
  return request(`/v1/update-end-call`, {
    method: 'PUT',
    data,
  });
}

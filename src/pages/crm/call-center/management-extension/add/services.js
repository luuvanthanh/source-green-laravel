import { Helper } from '@/utils';
import request from '@/utils/requestCrm';

export function updateEmployees(data = {}) {
  return request(`/v1/employee-extension`, {
    method: 'POST',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/extensions/${data.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['employee']),
    },
  });
}

export function getEmployees(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

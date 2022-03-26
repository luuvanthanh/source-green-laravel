import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/manager-calls', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getEmployees() {
  return request(`/v1/employees`, {
    method: 'GET',
    params: {
      orderBy: 'full_name',
    },
  });
}

import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function getUsers(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return request('/v1/decision-rewards', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/decision-rewards/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(id) {
  return request(`/v1/decision-rewards/${id}`, {
    method: 'GET',
    parse: true,
  });
}

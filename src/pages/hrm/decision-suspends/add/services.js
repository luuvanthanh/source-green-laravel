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
  return request('/v1/decision-suspends', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/decision-suspends/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/decision-suspends/${data.id}`, {
    method: 'GET',
  });
}

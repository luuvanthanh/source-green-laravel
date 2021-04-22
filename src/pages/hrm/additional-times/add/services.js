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
  return request('/v1/add-sub-times', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/add-sub-times/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/v1/add-sub-times/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function getToolDetails(params = {}) {
  return request('/tool-details', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function get(params = {}) {
  return request(`/meals/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/meals', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/meals/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/meals/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

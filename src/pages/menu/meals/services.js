import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/meals', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function remove(id) {
  return request(`/meals/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/meals/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function updateOrderIndex(data = {}) {
  return request(`/api/meals/update-orderIndex`, {
    method: 'PUT',
    data,
  });
}

import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/api/product-types', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getBranches(params = {}) {
  return request('/branches', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function add(data = {}) {
  return request('/time-tables', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/time-tables/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/time-tables/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

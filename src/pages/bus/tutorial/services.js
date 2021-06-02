import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/bus-routes', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/bus-routes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/bus-routes/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/bus-routes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

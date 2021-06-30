import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/bus-routes', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
      // eslint-disable-next-line no-nested-ternary
      isActive: params.isActive ? (params.isActive === 'ON' ? true : 'false') : undefined,
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
  return request(`/bus-routes/${data.id}/change-active`, {
    method: 'PUT',
    params: {
      id: data.id,
      isActive: data.isActive || 'false',
    },
  });
}

export function remove(id) {
  return request(`/bus-routes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

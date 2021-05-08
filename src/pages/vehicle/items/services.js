import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/bus-informations', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/bus-informations/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

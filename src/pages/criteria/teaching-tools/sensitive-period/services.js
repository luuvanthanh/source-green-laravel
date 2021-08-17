import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/sensitive-periods', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/sensitive-periods/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

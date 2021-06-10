import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/tool-groups', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/tool-groups/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

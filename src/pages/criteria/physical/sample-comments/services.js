import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/physical-criteria-template/feedback/list-of-pagging', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id = {}) {
  return request(`/physical-criteria-template/feedback/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}

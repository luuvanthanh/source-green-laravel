import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/physical-criteria-template/criteria/list-of-pagging', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id = {}) {
  return request(`/physical-criteria-template/criteria/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}

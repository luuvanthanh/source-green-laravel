import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/physical-evaluate-template/list-of-pagging', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    }
  });
}
export function remove(id = {}) {
  return request(`/physical-evaluate-template/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}

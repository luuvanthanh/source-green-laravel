import request from '@/utils/requestLogin';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/api/identity/roles', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/api/identity/roles/${id}`, {
    method: 'DELETE',
    data: {
      shift_id: id,
    },
    parse: true,
  });
}

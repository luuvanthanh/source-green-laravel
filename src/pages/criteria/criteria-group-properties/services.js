import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      type: 'HEALTH',
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/criteria-group-properties/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

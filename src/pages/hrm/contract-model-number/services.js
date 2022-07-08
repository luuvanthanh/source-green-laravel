import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/medical-problems', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit', 'date'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id = {}) {
  return request(`/medical-problems/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

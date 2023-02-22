import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/program', {
    method: 'GET',
    params: {
      ...params,
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id = {}) {
  return request(`/program/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
    cancelNotification: true,
  });
}

import request from '@/utils/request';
import requestLavarel from '@/utils/requestLavarel';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/classes', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/classes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getBranches(params = {}) {
  return requestLavarel('/v1/branches', {
    method: 'GET',
    params,
  });
}

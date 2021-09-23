import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/notification-module', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function update(data) {
  return request(`/notification-module/by-module`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function getTypes(params = {}) {
  return request('/notification-type', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

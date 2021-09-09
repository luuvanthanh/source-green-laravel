import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/configs/by-type', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/configs/by-type/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function updateStatus(data) {
  return request(`/configs/config-key/${data.id}/invisible`, {
    method: 'PUT',
    data,
    params: {
      ...data,
    },
    parse: true,
  });
}

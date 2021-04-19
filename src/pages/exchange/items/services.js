import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/communications', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/communications', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/communications/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/communications/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

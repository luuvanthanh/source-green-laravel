import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/employees', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/employees', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/employees/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

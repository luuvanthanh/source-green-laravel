import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      classStatus: params.class ? 'HAS_CLASS' : 'ALL',
    },
  });
}

export function add(data = {}) {
  return request('/students', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/students/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/students/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

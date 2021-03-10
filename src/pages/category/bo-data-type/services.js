import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/api/business-object-data-type', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function add(data = {}) {
  return request('/api/business-object-data-type', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/api/business-object-data-type/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/api/business-object-data-type/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function validateDelete(params) {
  return request(`/api/business-object-data-type/${params.id}/validate-delete`, {
    method: 'GET',
    params: {
      value: params.value,
    },
  });
}

export default get;

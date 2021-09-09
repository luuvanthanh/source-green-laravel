import request from '@/utils/request';
import { omit } from 'lodash';

export function getConfigTypes(params = {}) {
  return request('/configs/by-type', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function get(params = {}) {
  return request(`/configs/${params.id}/by-group`, {
    method: 'GET',
    params,
  });
}

export function add(data = {}) {
  return request('/configs/create-by-group', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/configs/${data.id}/create-by-group`, {
    method: 'PUT',
    data: {
      ...omit(data, 'id'),
    },
  });
}

export function remove(id) {
  return request(`/configs/create-by-group/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

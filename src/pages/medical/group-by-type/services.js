import request from '@/utils/request';

export function getConfigTypes(params = {}) {
  return request('/configs/by-type', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function get(params = {}) {
  return request(`/configs/group-by-type`, {
    method: 'GET',
    params,
  });
}

export function add(data = {}) {
  return request('/configs/create-by-multi-group', {
    method: 'PUT',
    data,
  });
}

import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/search-sources', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/search-sources/${id}`, {
    method: 'DELETE',
    params: {
      id,
    },
    parse: true,
  });
}

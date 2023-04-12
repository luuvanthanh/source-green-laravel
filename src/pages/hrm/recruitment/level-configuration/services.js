import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/recruitment-levels', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/recruitment-levels/${id}`, {
    method: 'DELETE',
    parse: true,
    data: {
      id,
    },
  });
}

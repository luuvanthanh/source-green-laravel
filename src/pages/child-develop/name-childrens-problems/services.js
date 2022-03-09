import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/name-assessment-periods', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(data = {}) {
  return request(`/v1/name-assessment-periods/${data}`, {
    method: 'DELETE',
    data: {
      id: data,
    },
    parse: true,
  });
}
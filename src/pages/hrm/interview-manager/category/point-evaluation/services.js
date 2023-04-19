import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/point-evaluations', {
    method: 'POST',
    data,
  });
}

export function getData(params = {}) {
  return request(`/v1/point-evaluations`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/test', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/test/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/test/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

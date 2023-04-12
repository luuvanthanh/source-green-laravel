import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/recruitment-levels', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/recruitment-levels/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/recruitment-levels/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

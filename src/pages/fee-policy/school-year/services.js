import request from '@/utils/requestLavarel';

export function get(params = {}) {
  return request('/v1/school-years', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function update(data = {}) {
  return request(`/v1/school-years/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

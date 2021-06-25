import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/fees', {
    method: 'POST',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/fees/${data?.id}`, {
    method: 'GET',
  });
}

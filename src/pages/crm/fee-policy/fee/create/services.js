import request from '@/utils/requestCrm';

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

export function update(data = {}) {
  return request(`/v1/fees/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/branches', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/branches/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/branches/${data.id}`, {
    method: 'GET',
  });
}

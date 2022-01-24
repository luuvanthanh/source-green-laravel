import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/class-arrangements', {
    method: 'POST',
    data,
  });
}

export function remove(id = {}) {
  return request(`/v1/class-arrangements/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getDetails(data) {
  return request('/v1/class-arrangements', {
    method: 'GET',
    data,
  });
}

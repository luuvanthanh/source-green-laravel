import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/town-wards', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/town-wards/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/town-wards/${data.id}`, {
    method: 'GET',
  });
}

export function remove(id = {}) {
  return request(`/v1/town-wards/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

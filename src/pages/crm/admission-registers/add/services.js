import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/status-admission-registers', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/status-admission-registers/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/status-admission-registers/${data.id}`, {
    method: 'GET',
  });
}

export function remove(id = {}) {
  return request(`/v1/status-admission-registers/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

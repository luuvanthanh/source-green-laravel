import request from '@/utils/request';

export function add(data = {}) {
  return request('/classes', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/classes/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/classes/${data.id}`, {
    method: 'GET',
  });
}

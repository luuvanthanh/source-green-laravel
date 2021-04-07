import request from '@/utils/request';

export function add(data = {}) {
  return request('/students', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/students/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return request(`/students/${data.id}`, {
    method: 'GET',
  });
}

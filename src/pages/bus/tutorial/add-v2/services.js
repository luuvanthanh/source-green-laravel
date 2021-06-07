import request from '@/utils/request';

export function add(data = {}) {
  return request('/bus-routes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/bus-routes/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return request(`/bus-routes/${data.id}`, {
    method: 'GET',
  });
}

import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/search-sources', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/search-sources/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/search-sources/${data.id}`, {
    method: 'GET',
  });
}

export function remove(id = {}) {
  return request(`/v1/search-sources/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

import request from '@/utils/request';

export function get(params = {}) {
  return request('/api/business-object-group', {
    method: 'GET',
    params
  });
}

export function add(data = {}) {
  return request('/api/business-object-group', {
    method: 'POST',
    data
  });
}

export function update(data = {}) {
  return request(`/api/business-object-group/${data.id}`, {
    method: 'PUT',
    data
  });
}

export function remove(id) {
  return request(`/api/business-object-group/${id}`, {
    method: 'DELETE',
    parse: true
  });
}

export default get;
import request from '@/utils/request';

export function get(params = {}) {
  return request(`/sensitive-periods/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/sensitive-periods', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/sensitive-periods/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/sensitive-periods/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

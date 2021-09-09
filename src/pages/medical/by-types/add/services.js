import request from '@/utils/request';

export function get(params = {}) {
  return request(`/configs/${params.id}`, {
    method: 'GET',
    params,
  });
}

export function add(data = {}) {
  return request('/configs', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/configs/${data.id}`, {
    method: 'PUT',
    params: {
      id: data.id,
    },
    data,
  });
}

export function remove(id) {
  return request(`/configs/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

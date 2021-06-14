import request from '@/utils/request';

export function get(params = {}) {
  return request(`/bus-informations/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/bus-informations', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/bus-informations/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/bus-informations/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

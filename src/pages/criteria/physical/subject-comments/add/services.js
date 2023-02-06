import request from '@/utils/request';

export function add(data = {}) {
  return request('/physical-criteria-template/criteria', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/physical-criteria-template/criteria/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/physical-criteria-template/criteria/${params.id}`, {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function remove(id = {}) {
  return request(`/physical-criteria-template/criteria/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

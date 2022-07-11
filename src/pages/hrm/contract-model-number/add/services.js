import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/number-form-contracts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/number-form-contracts/${data.id}`, {
    method: 'PUT',
    params: {
      id: data.id,
    },
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/number-form-contracts/${data.id}`, {
    method: 'GET',
    params: {
      ...data,
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/number-form-contracts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

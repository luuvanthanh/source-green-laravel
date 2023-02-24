import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/decision-number-samples', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/decision-number-samples/${data.id}`, {
    method: 'PUT',
    params: {
      id: data.id,
    },
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/decision-number-samples/${data.id}`, {
    method: 'GET',
    params: {
      ...data,
    },
  });
}

export function remove(id = {}) {
  return request(`/v1/decision-number-samples/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

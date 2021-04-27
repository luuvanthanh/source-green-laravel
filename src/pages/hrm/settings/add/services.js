import request from '@/utils/requestLavarel';

export function add(data) {
  return request('/v1/shifts', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data) {
  return request(`/v1/shifts/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(id) {
  return request(`/v1/shifts/${id}`, {
    method: 'GET',
    params: {
      include: 'shiftDetail',
    },
  });
}

import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/attendances-reasons', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/attendances-reasons/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/attendances-reasons/${data.id}`, {
    method: 'GET',
  });
}

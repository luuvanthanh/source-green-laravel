import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/decision-rewards', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/decision-rewards/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data) {
  return request(`/v1/decision-rewards/${data.id}`, {
    method: 'GET',
    parse: true,
  });
}

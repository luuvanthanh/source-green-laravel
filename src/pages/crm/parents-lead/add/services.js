import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/status-parent-leads', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/status-parent-leads/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/status-parent-leads/${data.id}`, {
    method: 'GET',
  });
}

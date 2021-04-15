import request from '@/utils/request';

export function add(data = {}) {
  return request('/employees', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/employees/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function details(data = {}) {
  return request(`/employees/${data.id}`, {
    method: 'GET',
  });
}

export function addAccount(data = {}) {
  return request(`/employees/${data.id}/account`, {
    method: 'POST',
    data,
  });
}

export function detailsAccount(data = {}) {
  return request(`/employees/${data.id}/account`, {
    method: 'GET',
  });
}

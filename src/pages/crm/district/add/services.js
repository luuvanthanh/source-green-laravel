import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/districts', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/districts/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/districts/${data.id}`, {
    method: 'GET',
  });
}

export function getCity(data) {
  return request('/v1/citys', {
    method: 'GET',
    data,
  });
}
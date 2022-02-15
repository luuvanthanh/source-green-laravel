import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/category-skills', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/category-skills/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/category-skills/${data.id}`, {
    method: 'GET',
  });
}

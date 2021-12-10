import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/category-child-issues', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/category-child-issues/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function details(data = {}) {
  return request(`/v1/category-child-issues/${data.id}`, {
    method: 'GET',
  });
}

export function remove(id = {}) {
  return request(`/v1/category-child-issues/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

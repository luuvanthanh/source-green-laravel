import request from '@/utils/request';

export function add(data = {}) {
  return request('/news', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/news/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function get(data = {}) {
  return request(`/news/${data.id}`, {
    method: 'GET',
  });
}

export function getClass(data = {}) {
  return request(`/classes`, {
    method: 'GET',
    params: {
      ...data,
    }
  });
}
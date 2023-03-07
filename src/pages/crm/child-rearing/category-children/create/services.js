import request from '@/utils/requestCrm';

export function add(data = {}) {
  return request('/v1/post-knowledge-to-teach-childrens', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/post-knowledge-to-teach-childrens/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/post-knowledge-to-teach-childrens/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

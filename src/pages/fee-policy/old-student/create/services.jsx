import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/charge-old-students', {
    method: 'POST',
    data,
  });
}

export function details(params = {}) {
  return request(`/v1/charge-old-students/${params?.id}`, {
    method: 'GET',
    params
  });
}

export function update(data = {}) {
  return request(`/v1/charge-old-students/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

import request from '@/utils/requestCrm';
import requestClover from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/school-years', {
    method: 'POST',
    data,
  });
}

export function details(data = {}) {
  return requestClover(`/v1/school-years/${data?.id}`, {
    method: 'GET',
  });
}

export function update(data = {}) {
  return request(`/v1/school-years/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

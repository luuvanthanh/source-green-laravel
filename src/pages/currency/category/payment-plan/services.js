import request from '@/utils/requestLavarel';
import requestClover from '@/utils/request';


export function get(params = {}) {
  return request('/v1/payment-plans', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function getYear(params = {}) {
  return request('/v1/school-years', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function getClass(params = {}) {
  return requestClover('/classes', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

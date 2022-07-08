import request from '@/utils/requestLavarel';

export function getRefund(params = {}) {
  return request(`/v1/refunds`, {
    method: 'GET',
    params,
  });
}

export function getData(params = {}) {
  return request(`/v1/student-refund`, {
    method: 'GET',
    params: {
      ...params,
      type: 'STORE',
    },
  });
}

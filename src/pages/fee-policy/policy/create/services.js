import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/fee-policies', {
    method: 'POST',
    data,
  });
}

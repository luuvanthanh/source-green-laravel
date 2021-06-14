import request from '@/utils/request';

export function add(data = {}) {
  return request('/class-students', {
    method: 'POST',
    data,
  });
}

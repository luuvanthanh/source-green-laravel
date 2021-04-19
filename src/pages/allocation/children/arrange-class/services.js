import request from '@/utils/request';

export function createClassStudent(data = {}) {
  return request('/class-students', {
    method: 'POST',
    data
  });
}

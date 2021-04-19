import request from '@/utils/request';

export function upload(data) {
  return request('/recorded-files/upload', {
    method: 'POST',
    data
  });
}

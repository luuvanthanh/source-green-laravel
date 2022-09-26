import request from '@/utils/request';

export function upload(data) {
  return request('/recorded-files/upload', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function create(data) {
  return request('/posts', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

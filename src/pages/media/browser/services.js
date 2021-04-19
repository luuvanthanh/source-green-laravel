import request from '@/utils/request';

export function get(params) {
  return request('/recorded-files', {
    method: 'GET',
    params
  });
}

export function classify(data) {
  return request('/recorded-files/classify', {
    method: 'POST',
    data
  });
}
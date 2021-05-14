import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params) {
  return request('/recorded-files', {
    method: 'GET',
    params: {
      ...params,
      uploadDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.uploadDate,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
    },
  });
}

export function classify(data) {
  return request('/recorded-files/classify', {
    method: 'POST',
    data,
  });
}

export function remove({ id }) {
  return request(`/recorded-files/${id}`, {
    method: 'DELETE',
  });
}

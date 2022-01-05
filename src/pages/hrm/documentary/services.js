import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/document-managements', {
    method: 'GET',
    params: {
      ...data,
      include: Helper.convertIncludes([
        'employee',
        'employeeSender',
        'branch',
        'sentDivision',
        'receiveDivision',
      ]),
    },
  });
}

export function remove(id) {
  return request(`/v1/document-managements/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

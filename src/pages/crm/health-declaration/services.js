import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function getData(params) {
  return request('/v1/config-medical-declares', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
      include: Helper.convertIncludes([
        'configMedicalDeclareDetail',
      ]),
    },
  });
}

export function add(data = {}) {
  return request('/v1/config-medical-declares', {
    method: 'POST',
    data,
  });
}
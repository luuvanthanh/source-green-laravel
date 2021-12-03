import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request(`/v1/config-medical-declares`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'slider',
        'banner',
        'contentThree.contentThreeDetail',
        'socialNetwork',
        'contentTwo',
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

import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/config-contents', {
    method: 'POST',
    data,
  });
}


export function get() {
  return request(`/v1/config-contents`, {
    method: 'GET',
   params : {
    include: Helper.convertIncludes([
      'configContentDetail',
    ]),
   }
  });
}
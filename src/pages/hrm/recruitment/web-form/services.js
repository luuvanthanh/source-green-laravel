import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';


export function add(data={}) {
  return request('/v1/create-candidate', {
    method: 'POST',
    data: {
      ...data,
    },
      parse: true,
      cancelNotification: true,
  });
}

export function get(data) {
  return request('/v1/get-form-recruitment', {
    method: 'GET',
    params: {
      endPoint: data?.endPoint,
      include: Helper.convertIncludes(['recruitmentConfiguration.question']),
    }
  });
}

import request from '@/utils/requestLavarel';
import requestClover from '@/utils/request';
import { Helper } from '@/utils';


export function get(params = {}) {
  return request('/v1/charge-old-students', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['student.classStudent.class', 'schoolYear']),
    },
  });
}

export function getYear(params = {}) {
  return request('/v1/school-years', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export function getClass(params = {}) {
  return requestClover('/classes', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

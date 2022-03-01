import request from '@/utils/requestLavarel';
import requestClover from '@/utils/request';
import { Helper } from '@/utils';


export function get(params = {}) {
  return request('/v1/payment-plans', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['paymentPlanDetail.chargeOldStudent.tuition,schoolYear,branch,classes,classType']),
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

export function remove(id = {}) {
  return request(`/v1/payment-plans/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
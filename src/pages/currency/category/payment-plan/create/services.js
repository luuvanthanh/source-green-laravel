import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/payment-plans', {
    method: 'POST',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/payment-plans/${data?.id}`, {
    method: 'GET',
  });
}

export function update(data = {}) {
  return request(`/v1/payment-plans/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

export function getYears(data = {}) {
  return request(`/v1/school-years`, {
    method: 'GET',
    data,
  });
}

export function getPayment(params = {}) {
  return request(`/v1/charge-old-students`, {
    method: 'GET',
    params: {
        schoolYearId: params?.schoolYearId,
        branchId: params?.branchId,
        classId: params?.classId,
        include: Helper.convertIncludes([
            'tuition',
            'student',
          ]),
    },
  });
}

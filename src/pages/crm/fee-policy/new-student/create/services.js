import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/charge-students', {
    method: 'POST',
    data,
  });
}

export function details(params = {}) {
  return request(`/v1/charge-students/${params?.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['studentInfo.parentInfo', 'admissionRegister.parentInfo,classType,schoolYear,studentInfo', 'schoolYear', 'tuition.paymentForm,tuition.fee']),
    }
  });
}

export function update(data = {}) {
  return request(`/v1/charge-students/${data?.id}`, {
    method: 'PUT',
    data
  });
}

export function moneyFeePolicies(params = {}) {
  return request('/v1/money-fee-policies', {
    method: 'GET',
    params,
  });
}

export function getStudents(params = {}) {
  return request('/v1/admission-registers', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'studentInfo', 'parentInfo'
      ]),
    },
  });
}

export function getClass(params = {}) {
  return request('/v1/class-types', {
    method: 'GET',
    params,
  });
}

export function getYears(params = {}) {
  return request('/v1/school-years', {
    method: 'GET',
    params,
  });
}
export function getFees(params = {}) {
  return request('/v1/fees', {
    method: 'GET',
    params,
  });
}

export function getPayment(params = {}) {
  return request('/v1/payment-forms', {
    method: 'GET',
    params,
  });
}
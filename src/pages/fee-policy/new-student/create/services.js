import request from '@/utils/requestLavarel';

export function add(data = {}) {
  return request('/v1/charge-students', {
    method: 'POST',
    data,
  });
}

export function details(params = {}) {
  return request(`/v1/charge-students/${params?.id}`, {
    method: 'GET',
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
  return request('/v1/potential-students', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

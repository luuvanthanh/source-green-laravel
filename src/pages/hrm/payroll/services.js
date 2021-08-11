import request from '@/utils/requestLavarel';

export function get(data = {}) {
  return request('/v1/payrolls', {
    method: 'GET',
    params: {
      ...data,
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
    },
  });
}

export function update(data) {
  return request(`/v1/payrolls/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function updateSalary(data) {
  return request(`/v1/payslip`, {
    method: 'POST',
    data,
  });
}

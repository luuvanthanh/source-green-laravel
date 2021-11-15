import request from '@/utils/requestCrm';

export function get(params) {
  return request(`/v1/customer-leads`, {
    method: 'GET',
    params : {
      ...params
    }
  });
}

export function getEmployees() {
  return request(`/v1/employees`, {
    method: 'GET',
    params: {
      orderBy: 'full_name',
    },
  });
}

export function assignment(data= []) {
  return request(`/v1/employee-customer-leads`, {
    method: 'POST',
    data: {
      employee_assignment: data
    }
  });
}
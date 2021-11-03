import request from '@/utils/requestCrm';

export function get() {
  return request(`/v1/customer-leads?is_null_employee=true`, {
    method: 'GET',
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
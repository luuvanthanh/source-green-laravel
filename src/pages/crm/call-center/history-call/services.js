import request from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/customer-leads', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        'city',
        'district',
        'search',
        'statusCare.statusParentLead',
        'studentInfo',
        'employee',
        'customerTag.tag',
        'searchSource',
      ]),
      employeeId: data.employeeId && data.employeeId.join(','),
    },
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

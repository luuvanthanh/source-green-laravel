import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/report-test-semesters', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      include: Helper.convertIncludes([
        'testSemester.testSemesterDetail.testSemesterDetailChildren',
        'classStudent.class',
        'schoolYear',
      ]),
    },
  });
}

export function getParents() {
  return request(`/v1/customer-leads`, {
    method: 'GET',
    params: {
      limit: 10000,
      page: 1,
    },
  });
}

export function getDistricts(params) {
  return request(`/v1/districts`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function add(data = {}) {
  return request(`/v1/move-customer-potentials`, {
    method: 'POST',
    data,
    parse: true,
  });
}

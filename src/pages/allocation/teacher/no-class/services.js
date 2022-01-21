import request from '@/utils/request';
import requestLaravel from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';

export function add(data) {
  return request('/class-teachers', {
    method: 'POST',
    data,
  });
}

export function getTeachers(params = {}) {
  return request('/class-teachers', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevelNow']),
    },
  });
}

export function changeClassTeacher({ id, data }) {
  return request(`/class-teachers/change-to-class/${id}`, {
    method: 'PUT',
    data,
  });
}

export function getPositions() {
  return requestLaravel('/v1/positions', {
    method: 'GET',
    params: {
      limit: variables.PAGINATION.SIZEMAX,
      page: variables.PAGINATION.PAGE,
    },
  });
}

import request from '@/utils/request';
import requestLavarel from '@/utils/requestLavarel';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

export function getNote(params = {}) {
  return request('/notes', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function detailsNote(data) {
  return request(`/notes/${data.id}`, {
    method: 'GET',
  });
}

export function getMedical(params = {}) {
  return request('/medicals', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function listMedicalbyStudent(params = {}) {
  return request('/medicals/record-books', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function detailsMedical(data) {
  return request(`/medicals/${data.id}`, {
    method: 'GET',
  });
}

export function getBus(params = {}) {
  return request('/medicals', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getBusByStatus(params = {}) {
  return request('/medicals', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getAttendance(params = {}) {
  return requestLavarel('/v1/attendance-summary', {
    method: 'GET',
    params: {
      ...params,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getAttendanceByStatus(params = {}) {
  return requestLavarel('/v1/attendances', {
    method: 'GET',
    params: {
      ...params,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      include: Helper.convertIncludes([
        'timekeeping',
        'class',
        'attendance',
        'absent',
        'classStudent.class',
      ]),
    },
  });
}

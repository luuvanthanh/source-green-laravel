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
  return request('/medicals/group-by-class', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      isReceived: params.isReceived === false ? 'false' : params.isReceived,
      from: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.from,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
      to: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.to,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
    },
  });
}

export function getMedicalTime(params = {}) {
  return request('/medicals/group-by-class-time', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
      from: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.from,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
      to: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.to,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: true,
      }),
    },
  });
}

export function reminder(data = {}) {
  return request(`/medicals/reminder`, {
    method: 'POST',
    data,
    parse: true,
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

export function getConfigs(_params = {}) {
  return request('/configs/group-by-type', {
    method: 'GET',
    params: {
      type: 'MEDICAL',
    },
  });
}

export function detailsMedical(data) {
  return request(`/medicals/${data.id}`, {
    method: 'GET',
  });
}

export function getBus(params = {}) {
  return request(`/bus-place-log/${params.date}/current-user/group-bus-place`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getBusByStatus(params = {}) {
  return request(`/bus-place-log/${params.date}/student-bus-places`, {
    method: 'GET',
    params: {
      ...omit({ ...params, date: undefined }, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function getBusByStatusHomeWardSchoolWard(params = {}) {
  return request(`/bus-place-log/${params.date}`, {
    method: 'GET',
    params: {
      ...omit({ ...params, date: undefined }, 'page', 'limit'),
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
        'parent',
        'class',
        'absent',
        'attendance',
        'timekeepßing',
        'classStudent.class',
        'classStudent.class.teacher',
      ]),
    },
  });
}

export function getClassAttendanceSummary(params = {}) {
  return requestLavarel('/v1/class-attendance-summary', {
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
        'parent',
        'classStudent.class.teacher',
      ]),
    },
  });
}

export function getClassDetails(params = {}) {
  return request(`/classes/${params.id}`, {
    method: 'GET',
    params: {},
  });
}

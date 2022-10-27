import requestLavarel from '@/utils/requestLavarel';
import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function getAbsentTypes(params = {}) {
  return requestLavarel('/v1/absent-type-students', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getAbsentReasons(params = {}) {
  return requestLavarel('/v1/absent-reason-students', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getStudents(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}

export function add(data = {}) {
  return requestLavarel('/v1/absent-students', {
    method: 'POST',
    data: {
      ...data,
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDate,
          targetValue: '00:00:00',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.endDate,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function update(data = {}) {
  return requestLavarel(`/v1/absent-students/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDate,
          targetValue: '00:00:00',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.endDate,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function get(params = {}) {
  return requestLavarel(`/v1/absent-students/${params.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['student.classStudent.class']),
    },
  });
}

export function getHoliday() {
  return requestLavarel('/v1/holidays', {
    method: 'GET',
    params: {
      include: Helper.convertIncludes(['holidayDetails']),
    },
  });
}

import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';
import variablesModules from '../utils/variables';

export function get(data = {}) {
  return request('/v1/schedule-students', {
    method: 'GET',
    params: {
      branchId: data.branchId,
      classId: data.classId,
      searchJoin: 'and',
      page: data.page,
      limit: data.limit,
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDate,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      endDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.endDate,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
      fullName: data.fullName,
      include: Helper.convertIncludes([
        'absent',
        'schedules.shift',
        'schedules.scheduleRepeat',
        'schedules.scheduleException',
        'classStudent.class',
      ]),
    },
  });
}

export function getShifts() {
  return request('/v1/shift-students', {
    method: 'GET',
    params: {
      status: 'ON',
      searchJoin: 'and',
    },
  });
}

export function addSchedulesDetail(data) {
  return request('/v1/schedule-students', {
    method: 'POST',
    data: {
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDateAdd,
        }),
        isUTC: false,
      }),
      studentId: data.studentId,
      shiftId: data.shiftId,
      repeatBy: data?.repeatBy,
      byWeekDay: data?.byWeekDay,
    },
    params: {
      include: 'employee,scheduleRepeat,shift',
    },
  });
}

export function removeSchedulesDetail(data) {
  if (data.isRepeat) {
    return request(`/v1/schedule-students/repeat/delete/${data.id}`, {
      method: 'DELETE',
      data: {
        date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: data.date,
          }),
          isUTC: false,
        }),
      },
      parse: true,
    });
  }
  return request(`/v1/schedule-students/${data.id}`, {
    method: 'DELETE',
    data: {
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDateRemove,
        }),
        isUTC: false,
      }),
    },
    parse: true,
  });
}

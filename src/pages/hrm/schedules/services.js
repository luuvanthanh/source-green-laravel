import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';
import variablesModules from '../utils/variables';

export function get(data = {}) {
  return request('/v1/schedule-employees', {
    method: 'GET',
    params: {
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
      order_by_position: true,
      include: Helper.convertIncludes([
        'absent',
        'schedules.shift',
        'positionLevel',
        'schedules.scheduleRepeat',
        'schedules.scheduleException',
      ]),
    },
  });
}

export function getShifts() {
  return request('/v1/shifts', {
    method: 'GET',
    params: {
      search: `status:${variablesModules.STATUS_SHIFT.ON}`,
      searchJoin: 'and',
    },
  });
}

export function addSchedulesDetail(data) {
  return request('/v1/schedules', {
    method: 'POST',
    data: {
      startDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.startDateAdd,
        }),
        isUTC: false,
      }),
      employeeId: data.employeeId,
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
    return request(`/v1/schedules/repeat/delete/${data.id}`, {
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
  return request(`/v1/schedules/${data.id}`, {
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

export function getHolidays(data = {}) {
  return request('/v1/holidays', {
    method: 'GET',
    params: {
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['holidayDetails']),
      search: Helper.convertParamSearchConvert({
        Name: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: data.startDate,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.YEAR,
          isUTC: false,
        }),
      }),
    },
  });
}

export function getBusinessCards(data = {}) {
  return request('/v1/business-cards', {
    method: 'GET',
    params: {
      orderBy: 'CreationTime',
      sortedBy: 'desc',
      searchJoin: 'and',
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
      include: Helper.convertIncludes(['employee', 'absentType', 'absentReason']),
    },
  });
}

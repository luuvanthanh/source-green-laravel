import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';
import variablesModules from '../utils/variables';

export function get(data = {}) {
  return request('/v1/schedule-users', {
    method: 'GET',
    params: {
      searchJoin: 'and',
      page: data.page,
      limit: data.limit,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '00:00:00',
        }),
        isUTC: false,
      }),
      end_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
      store_id: data?.store_id,
      search: Helper.convertParamSearchConvert({
        full_name: data.full_name,
      }),
      order_by_position: true,
      include: Helper.convertIncludes([
        'schedules.shift',
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
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date_add,
        }),
        isUTC: false,
      }),
      user_id: data.user_id,
      shift_id: data.shift_id,
      repeat_by: data?.repeat_by,
      by_week_day: data?.by_week_day,
    },
    params: {
      include: 'user,scheduleRepeat,shift',
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
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date_remove,
        }),
        isUTC: false,
      }),
    },
    parse: true,
  });
}

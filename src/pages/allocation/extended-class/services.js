import request from '@/utils/request';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request('/extended-class-registrations/group-by-date', {
    method: 'GET',
    params: {
      ...params,
      fromDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.fromDate,
          targetValue: '00:00:00',
        }),
        isUTC: true,
      }),
      toDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.toDate,
          targetValue: '23:59:59',
        }),
        isUTC: true,
      }),
    },
  });
}

export function getYears(params = {}) {
  return request('/timetable-settings', {
    method: 'GET',
    params,
  });
}

export function getActivities(params = {}) {
  return request('/timetable-activities/details', {
    method: 'GET',
    params,
  });
}

export function drag(data = {}) {
  return request('/extended-class-assignments/by-drag-drop', {
    method: 'POST',
    data: {
      ...data,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
        }),
        isUTC: false,
      }),
      fromTime: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.fromTime,
        }),
        isUTC: false,
      }),
      toTime: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.toTime,
        }),
        isUTC: false,
      }),
    },
    cancelNotification: true,
  });
}

export function updateActivies(data = {}) {
  return request('/timetables/by-detail-popup', {
    method: 'POST',
    data,
  });
}

export function removeActivites(data = {}) {
  return request(`/timetable-detail-activities/${data.id}`, {
    method: 'DELETE',
  });
}

export function dragCellByCell(data = {}) {
  return request(`/timetables/by-drag-drop/${data.id}`, {
    method: 'PUT',
    data,
  });
}

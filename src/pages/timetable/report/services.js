import request from '@/utils/request';

export function get(params = {}) {
  return request(`/event-timetable-attendances/group-by-class/${params.dataIDSearch}`, {
    method: 'GET',
    params,
  });
}

export function remove(id = {}) {
  return request(`/student-medical-problems/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function getEvents(params = {}) {
  return request(`/time-tables/events`, {
    method: 'GET',
    params,
  });
}
import request from '@/utils/request';

export function getData(data = {}) {
  return request(`/class-students/history-of-classes/by-classId/${data.id}`, {
    method: 'GET',
  });
}

export function getDataDetail(data = {}) {
  return request(
    `/class-students/history-of-studenta/by-classId/${data.classId}/by-schoolYearId/${data.schoolYearId}`,
    {
      method: 'GET',
    },
  );
}

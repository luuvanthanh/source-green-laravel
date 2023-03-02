import requestNet from '@/utils/request';

export function getDataStudent(params = {}) {
  return requestNet(`/physical-criteria-students/get-template-for-creating`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return requestNet('/physical-criteria-students', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function getDatDetail(params = {}) {
  return requestNet(`/physical-criteria-students/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

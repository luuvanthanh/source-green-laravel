import requestNet from '@/utils/request';

export function getDatDetail(params = {}) {
  return requestNet(`/physical-criteria-students/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function add(data = {}) {
  return requestNet(`/physical-criteria-students/${data?.id}`, {
    method: 'PUT',
    data: {
      ...data,
      id: data?.id,
    },
  });
}

export function approve(data = {}) {
  return requestNet(`/physical-criteria-students/approve`, {
    method: 'PUT',
    data,
  });
}

export function deleteItem(data = {}) {
  return requestNet(`/physical-criteria-students/reject/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

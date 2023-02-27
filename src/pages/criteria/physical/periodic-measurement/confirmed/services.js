import requestNet from '@/utils/request';
import { variables } from '@/utils';

export function getDatDetail(params = {}) {
  return requestNet(`/physical-criteria-students/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function update(data = {}) {
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

export function getConfirmation(data = {}) {
  return requestNet(`/criteria-standards`, {
    method: 'GET',
    params: {
      maxResultCount: variables.PAGINATION.SIZEMAX,
      type: data?.type,
    },
  });
}

export function getBmiStudent(params = {}) {
  return requestNet(`/student-criterias/statistic-by-physical/${params?.studentId}`, {
    method: 'GET',
    params,
    cancelNotification: true,
  });
}

export function updateConfirmation(data = {}) {
  return requestNet(`/physical-criteria-students/${data?.id}`, {
    method: 'PUT',
    data: {
      ...data,
      id: data?.id,
    },
    params: {
      isApproved: true,
    },
  });
}

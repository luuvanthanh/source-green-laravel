import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function getStudent(params = {}) {
  return request('/students', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function detailsStudent(data) {
  return request(`/students/${data.id}`, {
    method: 'GET',
  });
}

export function getBusByStudent(params) {
  return request(`/bus-place-log/student/${params.id}/${params.from}/${params.to}`, {
    method: 'GET',
    params: {
      status: params?.status || ''
    }
  });
}

export function getChildInClass(params) {
  return request(`/bus-place-log/student/${params.id}/${params.from}/${params.to}`, {
    method: 'GET',
    params: {
      status: params?.status || ''
    }
  });
}

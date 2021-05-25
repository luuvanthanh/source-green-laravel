import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper, variables } from '@/utils';

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

export function getHealthEveryDay(params = {}) {
  return request(`/student-criterias/${params.id}/by-student`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getHealthHistory(params = {}) {
  return request('/student-criterias/history-by-student', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getHealthChart(params = {}) {
  return request('/student-criterias/statistic-by-property', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getCriteriaGroupProperties() {
  return request('/criteria-group-properties', {
    method: 'GET',
    params: {
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      type: 'HEALTH',
    },
  });
}

export function getNote(params = {}) {
  return request('/notes', {
    method: 'GET',
    params: {
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

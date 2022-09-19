import request from '@/utils/request';
import { omit } from 'lodash';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/news', {
    method: 'POST',
    data,
    parse: true,
    editNotification: true,
    cancelNotification: true,
  });
}

export function update(data = {}) {
  return request(`/news/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function get(data = {}) {
  return request(`/news/${data.id}`, {
    method: 'GET',
  });
}

export function getClass(data = {}) {
  return request(`/classes`, {
    method: 'GET',
    params: {
      ...data,
    },
  });
}

export function getParents(params = {}) {
  return request(`/students/get-with-parent-account`, {
    method: 'GET',
    params: {
      ...params,
      studentStatus: 'OFFICAL',
      ...omit(params, 'page', 'limit'),
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function send(data = {}) {
  return request('/news/send', {
    method: 'POST',
    data,
    parse: true,
    editNotification: true,
    cancelNotification: true,
  });
}

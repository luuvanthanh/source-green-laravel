import request from '@/utils/request';
import requestLaravel from '@/utils/requestLavarel';
import requestSSO from '@/utils/requestSSO';
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

export function getEmployees(params = {}) {
  return requestLaravel('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['positionLevelNow', 'positionLevelNow.division']),
    },
  });
}

export function getCategory(params = {}) {
  return requestSSO(`/api/module`, {
    method: 'GET',
    params: {
      ...params,
      Code: 'QUY_TRINH_THONG_BAO',
      MaxResultCount: 1000,
    },
  });
}

export function getModule(params = {}) {
  return request(`/news/get-business-object-type/module/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function addApprove(data = {}) {
  return request(`/news/aprrove`, {
    method: 'PUT',
    data,
  });
}

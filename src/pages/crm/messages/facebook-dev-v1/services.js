import request from '@/utils/request';
import requestCrm from '@/utils/requestCrm';
import { Helper } from '@/utils';

export function get(data = {}) {
  return request('/v1/districts', {
    method: 'GET',
    params: {
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['city']),
    },
  });
}

export function getPages(params = {}) {
  return request('/v1/facebook/pages', {
    prefix: API_URL_CRM,
    method: 'GET',
    params,
  });
}

export function getConversations(params = {}) {
  return requestCrm('/v1/facebook/pages/get-conversations', {
    prefix: API_URL_CRM,
    method: 'GET',
    params: {
      ...params,
      show_conversation: 'true',
      orderBy: 'updated_at',
      sortedBy: 'desc',
      include: Helper.convertIncludes(['userFacebookInfo.userFacebookInfoTag.tag']),
    },
  });
}

export function getConversationsCall(params = {}) {
  return requestCrm('/v1/facebook/pages/get-conversations', {
    prefix: API_URL_CRM,
    method: 'GET',
    params: {
      ...params,
      show_conversation: 'true',
      orderBy: 'updated_at',
      sortedBy: 'desc',
      include: Helper.convertIncludes(['userFacebookInfo.userFacebookInfoTag.tag']),
    },
  });
}

export function getMessages(params = {}) {
  return request('/v1/facebook/pages/get-messages', {
    prefix: API_URL_CRM,
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
    },
  });
}

export function sendMessages(data = {}) {
  return request('/v1/facebook/pages/send-messages', {
    prefix: API_URL_CRM,
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function addConversations(data = {}) {
  return request('/v1/facebook/pages/synchronize-conversations', {
    prefix: API_URL_CRM,
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function addEmployee(data = {}) {
  return request('/v1/facebook/pages/employee-facebooks', {
    prefix: API_URL_CRM,
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function getPagesDb(params = {}) {
  return request('/v1/facebook/pages/get-pages', {
    prefix: API_URL_CRM,
    method: 'GET',
    params,
  });
}

export function getTags(params) {
  return requestCrm(`/v1/tags`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function addTags(data = {}) {
  return requestCrm('/v1/facebook/pages/user-facebook-info-tags', {
    method: 'POST',
    data,
  });
}

export function getConversationsId(params = {}) {
  return requestCrm(`/v1/facebook/pages/get-conversations`, {
    prefix: API_URL_CRM,
    method: 'GET',
    params: {
      ...params,
      show_conversation: 'true',
      orderBy: 'created_at',
      include: Helper.convertIncludes(['userFacebookInfo.userFacebookInfoTag.tag']),
    },
  });
}
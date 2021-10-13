import request from '@/utils/request';
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
  return request('/v1/facebook/pages/conversations', {
    prefix: API_URL_CRM,
    method: 'GET',
    params,
  });
}

export function getMessages(params = {}) {
  return request('/v1/facebook/pages/conversations/messages', {
    prefix: API_URL_CRM,
    method: 'GET',
    params,
  });
}

export function sendMessages(data = {}) {
  return request('/v1/facebook/pages/conversations/send-messages', {
    prefix: API_URL_CRM,
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

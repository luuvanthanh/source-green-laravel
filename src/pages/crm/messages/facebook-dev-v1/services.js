import request from '@/utils/request';
import requestCrm from '@/utils/requestCrm';
import { Helper } from '@/utils';
import { omit } from 'lodash';

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
      orderBy: 'time',
      sortedBy: 'desc',
      include: Helper.convertIncludes(['userFacebookInfo.userFacebookInfoTag.tag,userFacebookInfo.employeeFacebook']),
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
      orderBy: 'time',
      sortedBy: 'desc',
      include: Helper.convertIncludes(['userFacebookInfo.userFacebookInfoTag.tag,userFacebookInfo.employeeFacebook']),
    },
  });
}

export function getMessages(params = {}) {
  return request('/v1/facebook/pages/get-messages', {
    prefix: API_URL_CRM,
    method: 'GET',
    params: {
      ...params,
      hasMore: true,
      loading: true,
      orderBy: 'created_at',
      sortedBy: 'desc',
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
      include: Helper.convertIncludes(['userFacebookInfo.userFacebookInfoTag.tag,userFacebookInfo.employeeFacebook']),
    },
  });
}

export function updateNote(data = {}) {
  return request(`/v1/facebook/pages/user-facebook-infos/${data.conversationCurrent.userFacebookInfo.id}`, {
    prefix: API_URL_CRM,
    method: 'PUT',
    data: {
      note: data.noteValue,
    },
    cancelNotification: true,
  });
}

export function getRelationships() {
  return requestCrm(`/v1/category-relationships`, {
    method: 'GET',
  });
}

export function addLead(data = {}) {
  return requestCrm('/v1/facebook/pages/user-facebook-infos/add-leads', {
    method: 'POST',
    data,
    cancelNotification: true,
  });
}

export function detailsLead(params = {}) {
  return requestCrm(`/v1/customer-leads`, {
    method: 'GET',
    params: {
      id: params?.userFacebookInfo?.customer_lead_id,
      include: Helper.convertIncludes([
        'studentInfo.categoryRelationship',
        'city',
        'district',
        'searchSource',
        'statusLead',
        'statusCare.statusParentLead',
        'employee',
        'marketingProgram',
        'customerTag.tag',
        'relationship',
      ]),
    },
  });
}

export function getEmployeeFB(params) {
  return requestCrm(`/v1/facebook/pages/employee-facebooks`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function addEmployeeFB(data = {}) {
  return requestCrm('/v1/facebook/pages/specify-conversations', {
    method: 'POST',
    data,
  });
}

export function DeleteEmployeeFb(data = {}) {
  return requestCrm(`/v1/facebook/pages/delete-specify-conversations`, {
    method: 'POST',
    params: {
      ...data,
    },
  });
}
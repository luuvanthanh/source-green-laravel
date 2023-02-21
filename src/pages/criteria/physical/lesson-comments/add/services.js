import request from '@/utils/request';

// import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/physical-feedback-students', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/physical-feedback-students/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      id: undefined
    },
    parse: true,
  });
}

export function getData(params = {}) {
  return request(`/physical-feedback-students/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function rejectFeedback(data = {}) {
  return request(`/physical-feedback-students/reject/${data.id}`, {
    method: 'PUT',
    parse: true,
  });
}

export function approveFeedback(data = {}) {
  return request(`/physical-feedback-students/approve`, {
    method: 'PUT',
    params: {
      isAll: data?.isAll,
    },
    data: data?.listIdApprove,
    parse: true,
  });
}

export function getTemplateForCreating(params = {}) {
  return request(`/physical-feedback-students/get-template-for-creating`, {
    method: 'GET',
    params: {
      ...params,
    }
  });
}
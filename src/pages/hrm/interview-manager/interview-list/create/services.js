import request from '@/utils/requestLavarel';
import {  Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/interview-lists', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/v1/interview-lists/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function getData(params = {}) {
  return request(`/v1/interview-lists/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes(['division,interviewListEmployee,interviewConfiguration.interviewConfigurationEvaluationCriteria,pointEvaluation']),
    },
  });
}

export function addSendSuggestions(data = {}) {
  return request(`/v1/sendSuggestions/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}

export function addSendSuggestionsNotApproval(data = {}) {
  return request(`/v1/sendSuggestion-do-not-approve/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
    },
  });
}
import request from '@/utils/requestCrm';

export function get(params = {}) {
  return request('/v1/report-calls', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getChart(params = {}) {
  return request('/v1/statistics-customer-lead', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getChartTotal(params = {}) {
  return request('/v1/report-calls', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getChartEmployee(params = {}) {
  return request('/v1/report-calls', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export function getSaler(params = {}) {
  return request('/v1/employees', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

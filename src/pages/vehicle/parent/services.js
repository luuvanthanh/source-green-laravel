import request from '@/utils/request';
import moment from 'moment';
import { Helper, variables } from '@/utils';

export function get(params = {}) {
  return request(
    `/bus-place-log/student/${params.id}/${moment(params.date).format(
      variables.DATE_FORMAT.DATE_AFTER,
    )}`,
    {
      method: 'GET',
      params: {
        ...params,
        ...Helper.getPagination(params.page, params.limit),
      },
    },
  );
}

export function getTrackingCurrent(params = {}) {
  return request(`/bus-trackings`, {
    method: 'GET',
    params: {
      ...params,
      fromDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.fromDate,
        }),
        isUTC: true,
      }),
      toDate: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: params.toDate,
        }),
        isUTC: true,
      }),
    },
  });
}

export function add(data = {}) {
  return request('/bus-routes', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/bus-routes/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/bus-routes/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;

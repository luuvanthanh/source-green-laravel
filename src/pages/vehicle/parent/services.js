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
  return request(`/bus-trackings/${params.id}/current-location`, {
    method: 'GET',
    params: {
      ...params,
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

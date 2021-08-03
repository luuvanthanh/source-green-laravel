import request from '@/utils/request';

export function get(params = {}) {
  return request(`/time-tables/events/${params?.id}`, {
    method: 'GET',
  });
}

export default get;

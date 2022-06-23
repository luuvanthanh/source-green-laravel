import request from '@/utils/requestLavarel';
import { Helper } from '@/utils';

export function add(data = {}) {
  return request('/v1/refund-create-many', {
    method: 'POST',
    data,
  });
}

export function details(data = {}) {
  return request(`/v1/refunds/${data?.id}`, {
    method: 'GET',
    params: {
      ...data,
      include: Helper.convertIncludes(['refundDetail.configRefund', 'schoolYear']),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/refund-update-many/${data?.id}`, {
    method: 'PUT',
    data,
  });
}

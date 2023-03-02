import request from '@/utils/requestLavarel';
import { Helper, variables } from '@/utils';
import moment from 'moment';

export function add(data = {}) {
  return request('/v1/payment-plans', {
    method: 'POST',
    data: {
      datePlan: data?.datePlan
        ? Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: data.datePlan,
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          })
        : moment(),
      chargeMonth: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.chargeMonth,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      classTypeId: data?.classTypeId,
      schoolYearId: data?.schoolYearId,
      branchId: data?.branchId,
      classId: data?.classId,
      detail: data?.detail?.map((i) => ({
        ...i,
      })),
    },
  });
}

export function details(params = {}) {
  return request(`/v1/payment-plans/${params?.id}`, {
    method: 'GET',
    params: {
      include: Helper.convertIncludes([
        'paymentPlanDetail.student,schoolYear,branch,classes,classType',
      ]),
    },
  });
}

export function update(data = {}) {
  return request(`/v1/payment-plans/${data?.id}`, {
    method: 'PUT',
    data: {
      datePlan: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.datePlan,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      chargeMonth: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.chargeMonth,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      schoolYearId: data?.schoolYearId,
      branchId: data?.branchId,
      classId: data?.classId,
      classTypeId: data?.classTypeId,
      detail: data?.detail?.map((i) => ({
        ...i,
      })),
    },
  });
}

export function getYears(data = {}) {
  return request(`/v1/school-years`, {
    method: 'GET',
    data,
  });
}

export function getPayment(params = {}) {
  return request(`/v1/charge-old-students`, {
    method: 'GET',
    params: {
      month_payment_plan: params.month_payment_plan,
      schoolYearId: params?.schoolYearId,
      branchId: params?.branchId,
      classId: params?.classId,
      is_payment_plan: true,
      include: Helper.convertIncludes(['tuition', 'student']),
    },
  });
}

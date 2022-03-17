import request from '@/utils/requestCrm';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/customer-potentials', {
    method: 'POST',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function addStudents(data = {}) {
  return request('/v1/potential-student-infos', {
    method: 'POST',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function update(data = {}) {
  return request(`/v1/customer-potentials/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getStudent(params) {
  return request('/v1/potential-student-infos', {
    method: 'GET',
    params,
  });
}

export function details(params = {}) {
  return request(`/v1/customer-potentials/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'studentInfo',
        'city',
        'district',
        'customerPotentialStatusCare.statusParentPotential',
        'customerLead.studentInfo.admissionRegister.studentByChargeNow.chargeStudent.tuition.paymentForm,customerLead.studentInfo.admissionRegister.studentByChargeNow.chargeStudent.tuition.fee,customerLead.studentInfo.admissionRegister.studentByChargeNow.chargeStudent.classType,customerLead.studentInfo.admissionRegister.studentByChargeNow.chargeStudent.schoolYear,customerLead.studentInfo.admissionRegister.studentByChargeNow.chargeStudent.classType',
        'customerLead.studentInfo.admissionRegister.testInput.testInputDetail.categorySkill',
        'customerLead.studentInfo.admissionRegister.testInput.testInputDetail.testInputDetailChildren.childEvaluate,customerLead.studentInfo.admissionRegister.testInput.testInputDetail.testInputDetailChildren.childEvaluateDetail,customerLead.studentInfo.admissionRegister.testInput.testInputDetail.testInputDetailChildren.childEvaluateDetailChildren,testInputDetail.categorySkill,admissionRegister.studentInfo',
        'customerLead.studentInfo.admissionRegister.parentInfo',
        'customerLead.studentInfo.admissionRegister.testInput.employee,customerLead.studentInfo.admissionRegister.testInput.classType,customerLead.studentInfo.admissionRegister.testInput.branch',
      ]),
    },
  });
}

export function updateStatus(data = {}) {
  return request(`/v1/customer-potentials/${data.id}/update-status?status=${data.status}`, {
    method: 'PUT',
    data: {
      ...data,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      dateOfIssueIdCard: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.dateOfIssueIdCard,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function getCities() {
  return request(`/v1/citys`, {
    method: 'GET',
    params: {
      orderBy: 'name',
    },
  });
}

export function getDistricts(params) {
  return request(`/v1/districts`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getStatusLead(params = {}) {
  return request('/v1/customer-potential-status-cares', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes(['statusParentPotential']),
    },
  });
}

export function getParentLead() {
  return request(`/v1/status-parent-potentials`, {
    method: 'GET',
  });
}

export function addStatusLead(data = {}) {
  return request('/v1/customer-potential-status-cares', {
    method: 'POST',
    data,
  });
}

export function getSearch(params) {
  return request(`/v1/search-sources`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'name',
    },
  });
}

export function getRelationships() {
  return request(`/v1/category-relationships`, {
    method: 'GET',
  });
}

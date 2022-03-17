import request from '@/utils/requestCrm';
import { Helper, variables } from '@/utils';

export function add(data = {}) {
  return request('/v1/admission-registers', {
    method: 'POST',
    data: {
      ...data,
      date_register: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_register,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getCustomerLead() {
  return request(`/v1/customer-leads`, {
    method: 'GET',
    params: {
      orderBy: 'full_name',
    },
  });
}

export function getStudentsLead(params) {
  return request(`/v1/student-infos`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'full_name',
    },
  });
}

export function getStudentsId(params) {
  return request(`/v1/student-infos`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'full_name',
    },
  });
}

export function details(params = {}) {
  return request(`/v1/admission-registers/${params.id}`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'studentInfo,childEvaluateInfo.childDescription.childIssue',
         'parentInfo',
         'studentByChargeNow.chargeStudent.tuition.fee,studentByChargeNow.chargeStudent.classType,studentByChargeNow.chargeStudent.schoolYear', 
         'studentInfo.chargeStudent.tuition.fee,studentInfo.chargeStudent.tuition.paymentForm,studentInfo.chargeStudent.classType,studentInfo.chargeStudent.schoolYear',
        ]),
    },
  });
}

export function getParents(params) {
  return request('/v1/parent-infos', {
    method: 'GET',
    params: {
      ...params,
      limit: params.limit,
      page: params.page,
      orderBy: 'created_at',
    },
  });
}

export function getCities() {
  return request(`/v1/citys`, {
    method: 'GET',
    params: {
      orderBy: 'numerical_city',
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

export function addParents(data = {}) {
  return request('/v1/parent-infos', {
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

export function addWrittenConsent(data = {}) {
  return request('/v1/confirm-transporters', {
    method: 'POST',
    data: {
      ...data,
      date_register: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_register,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    },
  });
}

export function getWrittenConsent(params) {
  return request('/v1/confirm-transporters', {
    method: 'GET',
    params,
  });
}

export function updateStudents(data = {}) {
  return request(`/v1/admission-registers/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      date_register: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_register,
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

export function getEmloyees() {
  return request(`/v1/employees`, {
    method: 'GET',
    params: {
      orderBy: 'full_name',
    },
  });
}

export function addTestInput(data = {}) {
  return request('/v1/test-inputs', {
    method: 'POST',
    data: {
      ...data,
      date_interview: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_interview,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
      time_interview: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_interview,
        }),
        format: variables.DATE_FORMAT.HOUR,
        isUTC: false,
      }),
        parse: true,
    },
  });
}

export function getTestInputs(params = {}) {
  return request(`/v1/test-inputs`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'testInputDetail.testInputDetailChildren.childEvaluate,testInputDetail.testInputDetailChildren.childEvaluateDetail,testInputDetail.testInputDetailChildren.childEvaluateDetailChildren,testInputDetail.categorySkill,admissionRegister.studentInfo',
      ]),
    },
  });
}

export function getRelationships() {
  return request(`/v1/category-relationships`, {
    method: 'GET',
  });
}

export function addMedical(data = {}) {
  return request('/v1/medical-infos', {
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

export function getMedical(data = {}) {
  return request(`/v1/medical-infos`, {
    method: 'GET',
    params: {
      MedicalInfo:data.id,
      ...data,
      limit: data.limit,
      page: data.page,
      orderBy: 'created_at',
      sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        "medicalDeclareInfo.configMedicalDeclare,childHeathDevelop"
      ]),
    },
  });
}

export function getCategory(params) {
  return request(`/v1/config-medical-declares`, {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'created_at',
      // sortedBy: 'desc',
      // searchJoin: 'and',
    },
  });
}

export function getChildEvaluation(data = {}) {
  return request(`/v1/child-evaluate-infos/${data[0]?.id}`, {
    method: 'GET',
    params: {
      orderBy: 'created_at',
       sortedBy: 'desc',
      searchJoin: 'and',
      include: Helper.convertIncludes([
        "childDescription,childIssue"
      ]),
    },
  });
}

export function getBranches() {
  return request(`/v1/branches`, {
    method: 'GET',
  });
}
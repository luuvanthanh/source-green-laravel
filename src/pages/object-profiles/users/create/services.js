import request from '@/utils/request';
import { isEmpty } from 'lodash';
import { Helper, variables } from '@/utils';

const prefix = 'https://api-dev.erptran.projects.greenglobal.vn/api'

export function getStores() {
  return request('/v1/stores', {
    prefix,
    method: 'GET',
  });
}

export function getDivisions() {
  return request('/v1/divisions', {
    prefix,
    method: 'GET',
    params: {
      include: 'positions',
    },
  });
}

export function getPositions() {
  return request('/v1/positions', {
    prefix,
    method: 'GET',
  });
}

export function getRanks() {
  return request('/v1/ranks', {
    prefix,
    method: 'GET',
  });
}

export function getRoles() {
  return request('/v1/roles', {
    prefix,
    method: 'GET',
  });
}

export function getWorkForms() {
  return request('/v1/work-forms', {
    prefix,
    method: 'GET',
  });
}

export function getBeneficiaries() {
  return request('/v1/user/beneficiaries', {
    prefix,
    method: 'GET',
  });
}

export function getDetails(id) {
  return request(`/v1/users/${id}`, {
    prefix,
    method: 'GET',
  });
}

export function getDetailEducation(data) {
  return request(`/v1/user/educations`, {
    prefix,
    method: 'GET',
    params: {
      user_id: data.id,
      type: data.type,
    },
  });
}

export function getRankPositionInformations(id) {
  return request(`/v1/rank-position-informations`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getWorkHistory(id) {
  return request(`/v1/user/work-histories`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getHealthInformations(id) {
  return request(`/v1/user/health-informations`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getBankInformations(id) {
  return request(`/v1/user/bank-informations`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getContactInformations(id) {
  return request(`/v1/user/contact-informations`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getSabbaticalLeaves(id) {
  return request(`/v1/user/sabbatical-leaves`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getWorkTimes(id) {
  return request(`/v1/user/work-times`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getLaboursContracts(id) {
  return request(`/v1/user/labours-contracts`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
      include: Helper.convertIncludes(['user', 'labourContractCategory']),
    },
  });
}

export function getMinutesOfAgreements(id) {
  return request(`/v1/user/minutes-of-agreements`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
      include: Helper.convertIncludes(['user', 'labourContractCategory']),
    },
  });
}

export function getInsurrances(id) {
  return request(`/v1/user/insurrances`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
      include: Helper.convertIncludes(['user']),
    },
  });
}

export function getHealthInsurrances(id) {
  return request(`/v1/user/health-insurrances`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
      include: Helper.convertIncludes(['user', 'beneficiary']),
    },
  });
}

export function getSalaryInformations(id) {
  return request(`/v1/user/salary-informations`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
      include: 'user',
    },
  });
}

export function getChildren(id) {
  return request(`/v1/children`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        parent_id: id,
      }),
      include: 'user',
    },
  });
}

export function getReward(id) {
  return request(`/v1/user/reward`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      user_id: id,
    },
  });
}

export function getMagneticCards(id) {
  return request(`/v1/magnetic-cards`, {
    prefix,
    method: 'GET',
    params: {
      orderBy: 'id',
      sortedBy: 'desc',
      search: Helper.convertParamSearch({
        user_id: id,
      }),
    },
  });
}

export function getDetailsLaboursContracts(id) {
  return request(`/v1/user/labours-contracts/${id}`, {
    prefix,
    method: 'GET',
    params: {
      include: 'user',
    },
  });
}

export function getDetailsMinutesOfAgreement(id) {
  return request(`/v1/user/minutes-of-agreements/${id}`, {
    prefix,
    method: 'GET',
    params: {
      include: 'user',
    },
  });
}

export function getDetailsInsurrances(id) {
  return request(`/v1/user/insurrances/${id}`, {
    prefix,
    method: 'GET',
  });
}

export function getDetailsHealthInsurrances(id) {
  return request(`/v1/user/health-insurrances/${id}`, {
    prefix,
    method: 'GET',
    params: {
      include: 'beneficiary',
    },
  });
}

export function getDetailsChildren(id) {
  return request(`/v1/children/${id}`, {
    prefix,
    method: 'GET',
  });
}

export function getDetailsSalaryInformations(id) {
  return request(`/v1/user/salary-informations/${id}`, {
    prefix,
    method: 'GET',
    params: {
      include: 'user',
    },
  });
}

export function getLaboursContractCategories() {
  return request(`/v1/user/labours-contract-categories`, {
    prefix,
    method: 'GET',
  });
}

export function getDetailsRankPositionInformation(id) {
  return request(`/v1/rank-position-informations/${id}`, {
    prefix,
    method: 'GET',
  });
}

export function getDetailsReward(id) {
  return request(`/v1/reward/${id}`, {
    prefix,
    method: 'GET',
  });
}

export function addUser(data) {
  return request('/v1/users', {
    method: 'POST',
    data: {
      ...data,
      birthday: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birthday,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      date_of_issue_id_card: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_of_issue_id_card,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function addEducations(data) {
  if (data.type === 'TRINH_DO_CHUYEN_MON') {
    return request('/v1/user/educations', {
      method: 'POST',
      data: {
        ...data,
        update_rows: data.update_rows.map(item => ({
          ...item,
          date_of_issue: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.date_of_issue,
              targetValue: '23:59:59',
            }),
            format: variables.DATE_FORMAT.DATE_BEFORE,
            isUTC: false,
          }),
          education_type: data.type,
        })),
        create_rows: data.create_rows.map(item => ({
          ...item,
          date_of_issue: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.date_of_issue,
              targetValue: '23:59:59',
            }),
            format: variables.DATE_FORMAT.DATE_BEFORE,
            isUTC: false,
          }),
          education_type: data.type,
        })),
      },
    });
  }
  return request('/v1/user/educations', {
    method: 'POST',
    data: {
      ...data,
      update_rows: data.update_rows.map(item => ({
        ...item,
        date_of_issue: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: item.date_of_issue,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.DATE_BEFORE,
          isUTC: false,
        }),
        education_type: data.type,
      })),
      create_rows: data.create_rows.map(item => ({
        ...item,
        date_of_issue: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: item.date_of_issue,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.DATE_BEFORE,
          isUTC: false,
        }),
        education_type: data.type,
      })),
    },
  });
}

export function addRankPositionInformations(data) {
  return request('/v1/rank-position-informations', {
    method: 'POST',
    data: {
      ...data,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
    },
  });
}

export function addWorkHistory(data) {
  return request('/v1/user/work-histories', {
    method: 'POST',
    data: {
      ...data,
      update_rows: data.update_rows.map(item => ({
        ...item,
        start_date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: item.start_date,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.DATE_BEFORE,
          isUTC: false,
        }),
        end_date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: item.end_date,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.DATE_BEFORE,
          isUTC: false,
        }),
      })),
      create_rows: data.create_rows.map(item => ({
        ...item,
        start_date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: item.start_date,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.DATE_BEFORE,
          isUTC: false,
        }),
        end_date: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: item.end_date,
            targetValue: '23:59:59',
          }),
          format: variables.DATE_FORMAT.DATE_BEFORE,
          isUTC: false,
        }),
      })),
    },
    parse: true,
  });
}

export function addReward(data) {
  return request('/v1/reward', {
    method: 'POST',
    data: {
      ...data,
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function updateUser(data) {
  return request(`/v1/users/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      email: data.email || undefined,
      nation: data.nation || undefined,
      id_card: data.id_card || undefined,
      religion: data.religion || undefined,
      marriage_status: data.marriage_status || undefined,
      place_of_issue_id_card: data.place_of_issue_id_card || undefined,
      birthday: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birthday,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      date_of_issue_id_card: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date_of_issue_id_card,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function addHealthInformations(data) {
  return request('/v1/user/health-informations', {
    method: 'POST',
    data: {
      ...data,
      latest_inspection_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.latest_inspection_date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function changePassword(data) {
  return request('/v1/change-password', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function addBankInformations(data) {
  return request('/v1/user/bank-informations', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function addSabbaticalLeaves(data) {
  return request('/v1/user/sabbatical-leaves', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function addContactInformations(data) {
  return request('/v1/user/contact-informations', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function addMagneticCard(data) {
  return request('/v1/magnetic-cards', {
    method: 'POST',
    data,
    parse: true,
  });
}

export function addInsurrances(data) {
  return request('/v1/user/insurrances', {
    method: 'POST',
    data: {
      ...data,
      time_join: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_join,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      time_stop: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_stop,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function addHealthInsurrances(data) {
  return request('/v1/user/health-insurrances', {
    method: 'POST',
    data: {
      ...data,
      start_time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_time,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      end_time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_time,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    params: {
      include: Helper.convertIncludes(['beneficiary']),
    },
  });
}

export function addChildren(data) {
  return request('/v1/children', {
    method: 'POST',
    data: {
      parent_id: data.user_id,
      data: [
        {
          full_name: data.full_name,
          gender: data.gender,
          birthday: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: data.birthday,
              targetValue: '23:59:59',
            }),
            format: variables.DATE_FORMAT.DATE_BEFORE,
            isUTC: false,
          }),
        },
      ],
    },
  });
}

export function addWorkTimes(data) {
  return request('/v1/user/work-times', {
    method: 'POST',
    data: {
      ...data,
      sign_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.sign_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function addLaboursContracts(data) {
  return request('/v1/user/labours-contracts', {
    method: 'POST',
    data,
    params: {
      include: Helper.convertIncludes(['user', 'labourContractCategory']),
    },
  });
}

export function addMinutesAgreements(data) {
  return request('/v1/user/minutes-of-agreements', {
    method: 'POST',
    data,
    params: {
      include: Helper.convertIncludes(['user', 'labourContractCategory']),
    },
  });
}

export function addSalaryInformations(data) {
  return request('/v1/user/salary-informations', {
    method: 'POST',
    data: {
      ...data,
      time_application: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_application,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    params: {
      include: 'user',
    },
  });
}

export function updateLaboursContracts(data) {
  return request(`/v1/user/labours-contracts/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      files: !isEmpty(data.files)
        ? data.files.map(item => {
            const arrayFile = item.path.split('/');
            const files = arrayFile.map((item, index) => (index === 0 ? 'files' : item));
            return {
              path: files.join('/'),
              file_name: item.file_name,
            };
          })
        : [],
      expiration_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.expiration_date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      sign_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.sign_date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    params: {
      include: Helper.convertIncludes(['user', 'labourContractCategory']),
    },
  });
}

export function updateMinutesOfAgreements(data) {
  return request(`/v1/user/minutes-of-agreements/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      files: !isEmpty(data.files)
        ? data.files.map(item => {
            const arrayFile = item.path.split('/');
            const files = arrayFile.map((item, index) => (index === 0 ? 'files' : item));
            return {
              path: files.join('/'),
              file_name: item.file_name,
            };
          })
        : [],
      expiration_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.expiration_date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      sign_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.sign_date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    params: {
      include: Helper.convertIncludes(['user', 'labourContractCategory']),
    },
  });
}

export function updateInsurrances(data) {
  return request(`/v1/user/insurrances/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      time_join: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_join,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      time_stop: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_stop,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function updateHealthInsurrances(data) {
  return request(`/v1/user/health-insurrances/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      start_time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_time,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
      end_time: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.end_time,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    params: {
      include: Helper.convertIncludes(['beneficiary']),
    },
  });
}

export function updateSalaryInformations(data) {
  return request(`/v1/user/salary-informations/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      time_application: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.time_application,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
    params: {
      include: 'user',
    },
  });
}

export function updateChildren(data) {
  return request(`/v1/children/${data.id}`, {
    method: 'PUT',
    data: {
      full_name: data.full_name,
      gender: data.gender,
      birthday: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.birthday,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function updateRankPositionInformations(data) {
  return request(`/v1/rank-position-informations/${data.id}`, {
    method: 'PUT',
    data: {
      ...data,
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
    },
  });
}

export function updateReward(data) {
  return request(`/v1/reward/${data.id}`, {
    method: 'PATCH',
    data: {
      ...data,
      files: !isEmpty(data.files)
        ? data.files.map(item => {
            const arrayFile = item.path.split('/');
            const files = arrayFile.map((item, index) => (index === 0 ? 'files' : item));
            return {
              path: files.join('/'),
              file_name: item.file_name,
            };
          })
        : [],
      date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.date,
          targetValue: '23:59:59',
        }),
        format: variables.DATE_FORMAT.DATE_BEFORE,
        isUTC: false,
      }),
    },
  });
}

export function updateStatus(data) {
  return request(`/v1/magnetic-cards/${data.id}`, {
    method: 'PUT',
    data: {
      status: data.status,
    },
  });
}

export function updateStatusTimeKeeping(data) {
  if (data.status) {
    return request(`/v1/magnetic-cards/${data.id}`, {
      method: 'PATCH',
      parse: true,
    });
  }
  return request(`/v1/magnetic-cards/${data.id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function updateMagneticCard(data) {
  return request(`/v1/magnetic-cards/${data.id}`, {
    method: 'PUT',
    data,
    parse: true,
  });
}

export function removeLaboursContracts(id) {
  return request(`/v1/user/labours-contracts/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function removeMinutesOfAgreements(id) {
  return request(`/v1/user/minutes-of-agreements/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function removeInsurrances(id) {
  return request(`/v1/user/insurrances/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function removeHealthInsurrances(id) {
  return request(`/v1/user/health-insurrances/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function removeChildren(id) {
  return request(`/v1/children/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function removeSalaryInformations(id) {
  return request(`/v1/user/salary-informations/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export function removeRankPositionInformations(data) {
  return request(`/v1/rank-position-informations/${data.id}`, {
    method: 'DELETE',
    data: {
      start_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: data.start_date,
          targetValue: '23:59:59',
        }),
        isUTC: false,
      }),
    },
    parse: true,
  });
}

export function updateLock(data) {
  return request(`/v1/users/${data.id}`, {
    method: 'PUT',
    data: {
      status: data.status,
    },
  });
}

export function storage(id) {
  return request(`/v1/users/storage/${id}`, {
    method: 'PUT',
  });
}

export function removeReward(id) {
  return request(`/v1/reward/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

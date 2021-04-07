import { history } from 'umi';
import moment from 'moment';
import { notification } from 'antd';
import { get } from 'lodash';
import { variables } from '@/utils';
import { dataMenu } from './data.json';
import * as services from './services';

export default {
  namespace: 'userAdd',
  state: {
    data: [],
    isError: false,
    error: {
      data: {},
      isError: false,
    },
    details: {},
    dataMenu: [],
    detailEducations: {},
    category: {
      roles: [],
      ranks: [],
      stores: [],
      divisions: [],
      workForms: [],
      positions: [],
      laboursContracts: [],
      beneficiaries: [],
    },
    reward: [],
    children: [],
    insurrances: [],
    magneticCards: [],
    detailsWorkTimes: [],
    laboursContracts: [],
    healthInsurrances: [],
    detailsWorkHistory: [],
    salaryInformations: [],
    detailsAbbaticalLeaves: [],
    detailsBankInformations: [],
    detailsLaboursContracts: {},
    detailsHealthInfomations: [],
    rankPositionInformations: [],
    detailsContactInformation: [],
    minutesOfAgreement: []
  },
  reducers: {
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
    INIT_STATE: state => ({
      ...state,
      isError: false,
      data: [],
      error: {
        isError: false,
        data: {},
      },
    }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload,
    }),
    UPDATE_DATA: (state, { payload }) => ({
      ...state,
      data: state.data.map(item => {
        if (item.key === payload.key) {
          return {
            ...item,
            lock: payload.lock,
          };
        }
        return item;
      }),
    }),
    SET_UPDATE_STATUS: (state, { payload }) => ({
      ...state,
      magneticCards: state.magneticCards.map(item => (item.id === payload.id ? payload : item)),
    }),
    SET_UPDATE_STATUS_TIMEKEEPING: (state, { payload }) => ({
      ...state,
      magneticCards: state.magneticCards.map(item =>
        item.id === payload.id
          ? {
              ...item,
              timekeeping_status: payload.status ? variables.STATUS.ON : variables.STATUS.OFF,
            }
          : item,
      ),
    }),
    SET_MENU: (state, { payload }) => ({
      ...state,
      dataMenu: payload,
    }),
    SET_DETAILS: (state, { payload }) => ({
      ...state,
      details: payload.parsePayload,
    }),
    SET_DETAIL_EDUCATIONS: (state, { payload }) => ({
      ...state,
      detailEducations: payload.parsePayload,
    }),
    SET_DETAIL_RANK_POSITION_INFOMATIONS: (state, { payload }) => ({
      ...state,
      rankPositionInformations: payload.parsePayload,
    }),
    SET_DETAIL_WORK_HISTORY: (state, { payload }) => ({
      ...state,
      detailsWorkHistory: payload.parsePayload,
    }),
    SET_DETAIL_HEALTH_INFORMATIONS: (state, { payload }) => ({
      ...state,
      detailsHealthInfomations: payload.parsePayload,
    }),
    SET_DETAIL_BANK_INFORMATIONS: (state, { payload }) => ({
      ...state,
      detailsBankInformations: payload.parsePayload,
    }),
    SET_DETAIL_SABBATICAL_LEAVES: (state, { payload }) => ({
      ...state,
      detailsAbbaticalLeaves: payload.parsePayload,
    }),
    SET_DETAIL_CONTACT_INFORMATIONS: (state, { payload }) => ({
      ...state,
      detailsContactInformation: payload.parsePayload,
    }),
    SET_DETAIL_WORK_TIMES: (state, { payload }) => ({
      ...state,
      detailsWorkTimes: payload.parsePayload,
    }),
    SET_LABOURS_CONTRACTS: (state, { payload }) => ({
      ...state,
      laboursContracts: payload.parsePayload,
    }),
    SET_MINUTES_OF_AGREEMENT: (state, { payload }) => ({
      ...state,
      minutesOfAgreement: payload.parsePayload,
    }),
    SET_INSURRANCES: (state, { payload }) => ({
      ...state,
      insurrances: payload.parsePayload,
    }),
    SET_HEALTH_INSURRANCES: (state, { payload }) => ({
      ...state,
      healthInsurrances: payload.parsePayload,
    }),
    SET_CHILDREN: (state, { payload }) => ({
      ...state,
      children: payload.parsePayload,
    }),
    SET_SALARY_INFORMATIONS: (state, { payload }) => ({
      ...state,
      salaryInformations: payload.parsePayload,
    }),
    SET_REWARD: (state, { payload }) => ({
      ...state,
      reward: payload.parsePayload,
    }),
    SET_MAGNETICCARDS: (state, { payload }) => ({
      ...state,
      magneticCards: payload.parsePayload,
    }),
    SET_DATA_CATEGORY: (state, { payload }) => ({
      ...state,
      category: {
        ...state.category,
        stores: payload.stores.parsePayload,
        ranks: payload.ranks.parsePayload,
        workForms: payload.workForms.parsePayload,
        divisions: payload.divisions.parsePayload,
        roles: payload.roles.parsePayload,
      },
    }),
    SET_DATA_CATEGORY_RANK: (state, { payload }) => ({
      ...state,
      category: {
        ...state.category,
        ranks: payload.ranks.parsePayload,
        stores: payload.stores.parsePayload,
        workForms: payload.workForms.parsePayload,
        divisions: payload.divisions.parsePayload,
        roles: payload.roles.parsePayload,
      },
    }),
    SET_CATEGORY_CONTRACT: (state, { payload }) => ({
      ...state,
      category: {
        ...state.category,
        laboursContracts: payload.laboursContracts.parsePayload,
      },
    }),
    SET_DATA_CATEGORY_HISTORY: (state, { payload }) => ({
      ...state,
      category: {
        ...state.category,
        stores: payload.stores.parsePayload,
        positions: payload.positions.parsePayload,
      },
    }),
    SET_CATEGORY_HEALTH: (state, { payload }) => ({
      ...state,
      category: {
        ...state.category,
        beneficiaries: payload.beneficiaries.parsePayload,
      },
    }),
    SET_ADD_REWARD: (state, { payload }) => ({
      ...state,
      reward: [...state.reward, payload.parsePayload],
    }),
    SET_ADD_LABOURS_CONTRACTS: (state, { payload }) => ({
      ...state,
      laboursContracts: [...state.laboursContracts, payload.parsePayload],
    }),
    SET_ADD_MINUTES_OF_AGREEMENT: (state, { payload }) => ({
      ...state,
      minutesOfAgreement: [...state.minutesOfAgreement, payload.parsePayload],
    }),
    SET_ADD_RANK_POSITION_INFOMATIONS: (state, { payload }) => ({
      ...state,
      rankPositionInformations: [...state.rankPositionInformations, payload.parsePayload],
    }),
    SET_ADD_INSURRANCES: (state, { payload }) => ({
      ...state,
      insurrances: [...state.insurrances, payload.parsePayload],
    }),
    SET_ADD_HEALTH_INSURRANCES: (state, { payload }) => ({
      ...state,
      healthInsurrances: [...state.healthInsurrances, payload.parsePayload],
    }),
    SET_ADD_CHILDREN: (state, { payload }) => ({
      ...state,
      children: [...state.children, payload.parsePayload[0]],
    }),
    SET_ADD_SALARY_INFORMATIONS: (state, { payload }) => ({
      ...state,
      salaryInformations: [...state.salaryInformations, payload.parsePayload].map(item =>
        item.id === payload.parsePayload.id
          ? item
          : { ...item, status: variables.STATUS_PAYMENTS.EXPIRED },
      ),
    }),
    SET_REMOVE_LABOURS_CONTRACTS: (state, { payload }) => ({
      ...state,
      laboursContracts: state.laboursContracts.filter(item => item.id !== payload),
    }),
    SET_REMOVE_MINUTES_OF_AGREEMENT: (state, { payload }) => ({
      ...state,
      minutesOfAgreement: state.minutesOfAgreement.filter(item => item.id !== payload),
    }),
    SET_REMOVE_INSURRANCES: (state, { payload }) => ({
      ...state,
      insurrances: state.insurrances.filter(item => item.id !== payload),
    }),
    SET_REMOVE_HEALTH_INSURRANCES: (state, { payload }) => ({
      ...state,
      healthInsurrances: state.healthInsurrances.filter(item => item.id !== payload),
    }),
    SET_REMOVE_CHILDREN: (state, { payload }) => ({
      ...state,
      children: state.children.filter(item => item.id !== payload),
    }),
    SET_REMOVE_SALARY_INFORMATION: (state, { payload }) => ({
      ...state,
      salaryInformations: state.salaryInformations.filter(item => item.id !== payload),
    }),
    SET_UPDATE_LABOURS_CONTRACTS: (state, { payload }) => ({
      ...state,
      laboursContracts: state.laboursContracts.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_MINUTES_OF_AGREEMENT: (state, { payload }) => ({
      ...state,
      minutesOfAgreement: state.minutesOfAgreement.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_INSURRANCES: (state, { payload }) => ({
      ...state,
      insurrances: state.insurrances.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_HEALTH_INSURRANCES: (state, { payload }) => ({
      ...state,
      healthInsurrances: state.healthInsurrances.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_CHILDREN: (state, { payload }) => ({
      ...state,
      children: state.children.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_SALARY_INFORMATIONS: (state, { payload }) => ({
      ...state,
      salaryInformations: state.salaryInformations.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_RANK_POSITION_INFOMATIONS: (state, { payload }) => ({
      ...state,
      rankPositionInformations: state.rankPositionInformations.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_UPDATE_REWARD: (state, { payload }) => ({
      ...state,
      reward: state.reward.map(item =>
        item.id === payload.parsePayload.id ? payload.parsePayload : item,
      ),
    }),
    SET_REMOVE_RANK_POSITION_INFORMATIONS: (state, { payload }) => ({
      ...state,
      rankPositionInformations: state.rankPositionInformations.filter(
        item => item.id !== payload.id,
      ),
    }),
    SET_REMOVE_REWARD: (state, { payload }) => ({
      ...state,
      reward: state.reward.filter(item => item.id !== payload),
    }),
  },
  effects: {
    *GET_MENU(_, saga) {
      try {
        yield saga.put({
          type: 'SET_MENU',
          payload: dataMenu,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_CATEGORY(_, saga) {
      try {
        const response = yield saga.all({
          stores: saga.call(services.getStores),
          ranks: saga.call(services.getRanks),
          divisions: saga.call(services.getDivisions),
          workForms: saga.call(services.getWorkForms),
          roles: saga.call(services.getRoles),
        });
        if (response) {
          yield saga.put({
            type: 'SET_DATA_CATEGORY',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_CATEGORY_RANK(_, saga) {
      try {
        const response = yield saga.all({
          ranks: saga.call(services.getRanks),
          stores: saga.call(services.getStores),
          divisions: saga.call(services.getDivisions),
          workForms: saga.call(services.getWorkForms),
          roles: saga.call(services.getRoles),
        });
        if (response) {
          yield saga.put({
            type: 'SET_DATA_CATEGORY_RANK',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_CATEGORY_HISTORY(_, saga) {
      try {
        const response = yield saga.all({
          stores: saga.call(services.getStores),
          positions: saga.call(services.getPositions),
        });
        if (response) {
          yield saga.put({
            type: 'SET_DATA_CATEGORY_HISTORY',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_CATEGORY_CONTRACT(_, saga) {
      try {
        const response = yield saga.all({
          laboursContracts: saga.call(services.getLaboursContractCategories),
        });
        if (response) {
          yield saga.put({
            type: 'SET_CATEGORY_CONTRACT',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_CATEGORY_HEALTH(_, saga) {
      try {
        const response = yield saga.all({
          beneficiaries: saga.call(services.getBeneficiaries),
        });
        if (response) {
          yield saga.put({
            type: 'SET_CATEGORY_HEALTH',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAILS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'INIT_STATE',
        });
        const response = yield saga.call(services.getDetails, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DETAIL_EDUCATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getDetailEducation, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_EDUCATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_RANK_POSITION_INFOMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getRankPositionInformations, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_RANK_POSITION_INFOMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_WORK_HISTORY({ payload }, saga) {
      try {
        const response = yield saga.call(services.getWorkHistory, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_WORK_HISTORY',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_HEALTH_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getHealthInformations, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_HEALTH_INFORMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_BANK_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getBankInformations, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_BANK_INFORMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_CONTACT_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getContactInformations, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_CONTACT_INFORMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_SABBATICAL_LEAVES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSabbaticalLeaves, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_SABBATICAL_LEAVES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAIL_WORK_TIMES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getWorkTimes, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAIL_WORK_TIMES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAILS_REWARD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsReward, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_REWARD({ payload }, saga) {
      try {
        const response = yield saga.call(services.getReward, payload);
        if (response) {
          yield saga.put({
            type: 'SET_REWARD',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_LABOURS_CONTRACTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getLaboursContracts, payload);
        if (response) {
          yield saga.put({
            type: 'SET_LABOURS_CONTRACTS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_MINUTES_OF_AGREEMENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.getMinutesOfAgreements, payload);
        if (response) {
          yield saga.put({
            type: 'SET_MINUTES_OF_AGREEMENT',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getInsurrances, payload);
        if (response) {
          yield saga.put({
            type: 'SET_INSURRANCES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_HEALTH_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.getHealthInsurrances, payload);
        if (response) {
          yield saga.put({
            type: 'SET_HEALTH_INSURRANCES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_CHILDREN({ payload }, saga) {
      try {
        const response = yield saga.call(services.getChildren, payload);
        if (response) {
          yield saga.put({
            type: 'SET_CHILDREN',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_SALARY_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getSalaryInformations, payload);
        if (response) {
          yield saga.put({
            type: 'SET_SALARY_INFORMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *GET_DETAILS_LABOURS_CONTRACTS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsLaboursContracts, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS_MINUTEST_OF_AGREEMENT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsMinutesOfAgreement, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS_INSURRANCES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsInsurrances, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS_HEALTH_INSURRANCES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsHealthInsurrances, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS_CHILDREN({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsChildren, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS_SALARY_INFORMATIONS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsSalaryInformations, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_DETAILS_RANK_POSITION_INFORMATION({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getDetailsRankPositionInformation, payload);
        if (response) callback(response.parsePayload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_MAGNETICCARDS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getMagneticCards, payload);
        if (response) {
          yield saga.put({
            type: 'SET_MAGNETICCARDS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_REWARD({ payload }, saga) {
      try {
        const response = yield saga.call(services.addReward, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_REWARD',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_USER({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.addUser, payload);
        if (response) {
          yield saga.call(services.addRankPositionInformations, {
            ...payload,
            user_id: response.parsePayload.id,
            start_date: moment(response.parsePayload.created_at),
          });
          yield saga.call(services.addWorkTimes, {
            ...payload,
            user_id: response.parsePayload.id,
            start_date: moment(payload.start_date),
          });
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          callback(response);
          history.push(`/nhan-vien/${get(response, 'parsePayload.id')}?type=info`);
        }
      } catch (error) {
        callback(null, error);
      }
    },
    *ADD_EDUCATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.addEducations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_DETAIL_EDUCATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_WORK_HISTORY({ payload }, saga) {
      try {
        const response = yield saga.call(services.addWorkHistory, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_RANK_POSITION_INFOMATIONS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.addRankPositionInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          callback(response);
        }
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: 'Lỗi hệ thống. Bạn vui lòng kiểm tra dữ liệu nhập',
        });
        callback(null, error);
      }
    },
    *ADD_HEALTH_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.addHealthInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_BANK_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.addBankInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_SABBATICAL_LEAVES({ payload }, saga) {
      try {
        const response = yield saga.call(services.addSabbaticalLeaves, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_CONTACT_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.addContactInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_WORK_TIMES({ payload }, saga) {
      try {
        const response = yield saga.call(services.addWorkTimes, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_LABOURS_CONTRACTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.addLaboursContracts, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_LABOURS_CONTRACTS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_MINUTES_OF_AGREEMENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.addMinutesAgreements, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_MINUTES_OF_AGREEMENT',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.addInsurrances, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_INSURRANCES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_HEALTH_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.addHealthInsurrances, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_HEALTH_INSURRANCES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_CHILDREN({ payload }, saga) {
      try {
        const response = yield saga.call(services.addChildren, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_CHILDREN',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_SALARY_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.addSalaryInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_ADD_SALARY_INFORMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *ADD_MAGNETIC_CARD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.addMagneticCard, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'GET_MAGNETICCARDS',
            payload: payload.user_id,
          });
          callback(response);
        }
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR_MAGNETIC_CARD',
        });
      }
    },
    *UPDATE_REWARD({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateReward, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_REWARD',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_LABOURS_CONTRACTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateLaboursContracts, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_LABOURS_CONTRACTS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_MINUTES_OF_AGREEMENT({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateMinutesOfAgreements, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_MINUTES_OF_AGREEMENT',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateInsurrances, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_INSURRANCES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_HEALTH_INSURRANCES({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateHealthInsurrances, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_HEALTH_INSURRANCES',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_CHILDREN({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateChildren, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_CHILDREN',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_SALARY_INFORMATIONS({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateSalaryInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_SALARY_INFORMATIONS',
            payload: response,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_RANK_POSITION_INFOMATIONS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateRankPositionInformations, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          callback(response);
        }
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_USER({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateUser, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response,
          });
          callback(response);
          history.push(`/nhan-vien/${get(response, 'parsePayload.id')}?type=info`);
        }
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_USER_LOCK({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateLock, payload);
        if (response) {
          yield saga.put({
            type: 'SET_DETAILS',
            payload: response,
          });
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_MAGNETIC_CARD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.updateMagneticCard, payload);
        if (response) {
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
          yield saga.put({
            type: 'SET_UPDATE_MAGNETIC_CARD',
            payload: response,
          });
          callback(response);
        }
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR_MAGNETIC_CARD',
        });
      }
    },
    *UPDATE_STATUS({ payload }, saga) {
      try {
        const response = yield saga.call(services.updateStatus, payload);
        if (response) {
          yield saga.put({
            type: 'SET_UPDATE_STATUS',
            payload: response.parsePayload,
          });
          notification.success({
            message: 'Cập nhật thành công',
            description: 'Bạn đã cập nhật thành công dữ liệu',
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *UPDATE_STATUS_TIMEKEEPING({ payload }, saga) {
      try {
        yield saga.call(services.updateStatusTimeKeeping, payload);
        yield saga.put({
          type: 'SET_UPDATE_STATUS_TIMEKEEPING',
          payload,
        });
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_REWARD({ payload }, saga) {
      try {
        yield saga.call(services.removeReward, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_REWARD',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_LABOURS_CONTRACT({ payload }, saga) {
      try {
        yield saga.call(services.removeLaboursContracts, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_LABOURS_CONTRACTS',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_MINUTES_OF_AGREEMENT({ payload }, saga) {
      try {
        yield saga.call(services.removeMinutesOfAgreements, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_MINUTES_OF_AGREEMENT',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_INSURRANCES({ payload }, saga) {
      try {
        yield saga.call(services.removeInsurrances, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_INSURRANCES',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_HEALTH_INSURRANCES({ payload }, saga) {
      try {
        yield saga.call(services.removeHealthInsurrances, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_HEALTH_INSURRANCES',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_CHILDREN({ payload }, saga) {
      try {
        yield saga.call(services.removeChildren, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_CHILDREN',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_SALARY_INFORMATION({ payload }, saga) {
      try {
        yield saga.call(services.removeSalaryInformations, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_SALARY_INFORMATION',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *REMOVE_RANK_POSITION_INFORMATIONS({ payload }, saga) {
      try {
        yield saga.call(services.removeRankPositionInformations, payload);
        notification.success({
          message: 'Cập nhật thành công',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
        yield saga.put({
          type: 'SET_REMOVE_RANK_POSITION_INFORMATIONS',
          payload,
        });
      } catch (error) {
        notification.error({
          message: 'Thông báo',
          description: 'Điều chuyển đã được áp dụng, không được xóa',
        });
        yield saga.put({
          type: 'SET_ERROR_REMOVE',
        });
      }
    },
    *STORAGE({ payload }, saga) {
      try {
        yield saga.call(services.storage, payload);
        history.push(`/nhan-vien`);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *CHANGE_PASSWORD({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.changePassword, payload);
        if (response) callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
  subscriptions: {},
};

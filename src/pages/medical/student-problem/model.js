// import * as services from './services';

export default {
  namespace: 'medicalStudentProblem',
  state: {
    data: [
      {
        key: 1,
        id: 1,
        time: '25/11/2021, 10:15',
        name: 'Tương tác xã hội',
        basis: 'Lake View',
        class: 'Preschool 1',
        Trouble: 'Lake View',
        Wound_location: 'Tay',
        Symptom: 'Sưng đỏ',
        status: 'APPLY',
      },
      {
        key: 2,
        id: 2,
        time: '25/11/2021, 10:15',
        name: 'Tương tác xã hội',
        basis: 'Lake View',
        class: 'Preschool 1',
        Trouble: 'Lake View',
        Wound_location: 'Tay',
        Symptom: 'Sưng đỏ',
        status: 'APPLY',
      },
      {
        key: 3,
        id: 3,
        time: '25/11/2021, 10:15',
        name: 'Tương tác xã hội',
        basis: 'Lake View',
        class: 'Preschool 1',
        Trouble: 'Lake View',
        Wound_location: 'Tay',
        Symptom: 'Sưng đỏ',
        status: 'APPLY',
      },
    ],
    pagination: {
      total: 0,
    },
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload.parsePayload,
      pagination: payload.pagination,
    }),
    SET_ERROR: (state, { payload }) => ({
      ...state,
      error: {
        isError: true,
        data: {
          ...payload,
        },
      },
    }),
  },
  effects: {
    // *GET_DATA({ payload }, saga) {
    //   try {
    //     const response = yield saga.call(services.get, payload);
    //     if (response) {
    //       yield saga.put({
    //         type: 'SET_DATA',
    //         payload: response,
    //       });
    //     }
    //   } catch (error) {
    //     yield saga.put({
    //       type: 'SET_ERROR',
    //       payload: error.data,
    //     });
    //   }
    // },
    // *REMOVE({ payload, callback }, saga) {
    //   try {
    //     yield saga.call(services.remove, payload.id);
    //     callback(payload);
    //   } catch (error) {
    //     callback(null, error);
    //   }
    // },
  },
  subscriptions: {},
};

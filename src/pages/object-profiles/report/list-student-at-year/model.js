import * as services from './services';

  export default {
    namespace: 'OPListStudentStudyAtYear',
    state: {
      data: [],
      pagination: {
        total: 0,
      },
      error: {
        isError: false,
        data: {},
      },
      branches: [],
      classes: [],
      years: [],
    },
    reducers: {
      INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
      SET_DATA: (state, { payload }) => ({
        ...state,
        data: payload.parsePayload.map((key) => ({
         branch : (key?.branch || {}),
         total : (key?.total || ""),
         children:( 
          key?.studentGroupByClasses.map((item) => ({
            class : item?.class,
            total : item?.total,
            id: item?.class?.id,
            children: (
              item?.students.map((i) => ({
                ...i
              }))
            )
          }))
         )
        })),
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
      SET_YEARS: (state, { payload }) => ({
        ...state,
        years: payload,
      }),
    },
    effects: {
      *GET_DATA({ payload }, saga) {
        try {
          const response = yield saga.call(services.get, payload);
          yield saga.put({
            type: 'SET_DATA',
            payload: {
              parsePayload: response,
              pagination: {
                total: response.totalCount,
              },
            },
          });
        } catch (error) {
          yield saga.put({
            type: 'SET_ERROR',
            payload: error.data,
          });
        }
      },
      *GET_YEARS({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getYears, payload);
        if (response) {
          callback(response.items);
          yield saga.put({
            type: 'SET_YEARS',
            payload: response.items,
          });
        }
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    },
    subscriptions: {},
  };
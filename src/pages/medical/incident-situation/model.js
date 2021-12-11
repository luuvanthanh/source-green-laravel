export default {
  namespace: 'medicalIncidentSituation',
  state: {
    data: [
      {
        date: 'Lake View',
        id: 1,
        items: [
          {
            id: '1',
            full_name: 'Nguyễn Văn A',
            basis: 'Lake View',
            class: 'Preschool 1',
            file_image: '',
            Trouble: 'Lake View',
            Wound_location: 'Tay',
            Symptom: 'Sưng đỏ',
            status: 'APPLY',
          },
          {
            id: '2',
            full_name: 'Nguyễn Văn A',
            basis: 'Lake View',
            class: 'Preschool 1',
            file_image: '',
            Trouble: 'Lake View',
            Wound_location: 'Tay',
            Symptom: 'Sưng đỏ',
            status: 'APPLY',
          },
          {
            id: '3',
            full_name: 'Nguyễn Văn A',
            basis: 'Lake View',
            class: 'Preschool 1',
            file_image: '',
            Trouble: 'Lake View',
            Wound_location: 'Tay',
            Symptom: 'Sưng đỏ',
            status: 'APPLY',
          },
        ],
      },
      {
        date: 'Cơ sở 2',
        id: 2,
        items: [
          {
            id: '2',
            full_name: 'Nguyễn Văn A',
            basis: 'Lake View',
            class: 'Preschool 1',
            file_image: '',
            Trouble: 'Lake View',
            Wound_location: 'Tay',
            Symptom: 'Sưng đỏ',
            status: 'APPLY',
          },
        ],
      },
    ],
    error: {
      isError: false,
      data: {},
    },
    pagination: {
      total: 0,
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state }),
  },
  effects: {
    // *GET_DATA({ payload }, saga) {
    //   try {
    //     const response = yield saga.call(services.get, payload);
    //     yield saga.put({
    //       type: 'SET_DATA',
    //       payload: response.payload,
    //     });
    //   } catch (error) {
    //     yield saga.put({
    //       type: 'SET_ERROR',
    //       payload: error.data,
    //     });
    //   }
    // },
  },
};

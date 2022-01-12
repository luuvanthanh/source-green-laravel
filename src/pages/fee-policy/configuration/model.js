
export default {
  namespace: 'feePolicyConfiguration',
  state: {
    data: [
      {
        id: 1,
        year: '2021 - 2022',
        time: '25/08/2021 - 31/05/2022',
      },
      {
        id: 2,
        year: '2021 - 2022',
        time: '01/08/2020 - 31/05/2021',
      },
      {
        id: 3,
        year: '2021 - 2022',
        time: '01/08/2019 - 31/05/2020',
      }
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
  },
  effects: {
  },
  subscriptions: {},
};

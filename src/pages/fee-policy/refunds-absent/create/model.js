
export default {
  namespace: 'feePolicyRefundsAbsentAdd',
  state: {
    data: [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        day: '15/08/2021',
        feeType : [
          {
            id: 1,
            name: 'Tiền học phí',
          },
          {
            id: 1,
            name: 'Phí tiền ăn',
          },
          {
            id: 1,
            name: 'Phí tiền bus',
          },
        ],
        money: [
          {
            id: 1,
            name: '40.000.000',
          },
          {
            id: 1,
            name: '15.000.000',
          },
          {
            id: 1,
            name: '5.000.000',
          },
        ],
      },
      {
        id: 2,
        name: 'Nguyễn Văn A',
        day: '15/08/2021',
        feeType : [
          {
            id: 1,
            name: 'Tiền học phí',
          },
          {
            id: 1,
            name: 'Phí tiền ăn',
          },
          {
            id: 1,
            name: 'Phí tiền bus',
          },
        ],
        money: [
          {
            id: 1,
            name: '40.000.000',
          },
          {
            id: 1,
            name: '15.000.000',
          },
          {
            id: 1,
            name: '5.000.000',
          },
        ],
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
  },
  effects: {
  },
  subscriptions: {},
};

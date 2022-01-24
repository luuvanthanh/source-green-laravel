export default {
  namespace: 'OPStudentByBranch',
  state: {
    data: [
      {
        key: 1,
        name: 'Cơ sở',
        birthDay: 'Lake view',
        children: [
          {
            key: 11,
            name: 'Nguyễn Thị Anh Thư',
            birthDay: '10/2/2017',
            age: 58,
            class: 'Preschool',
            date: '01/08/2018',
            father_name: 'Nguyễn Văn Thanh',
            mother_name: 'Nguyễn Thị Minh Nguyệt',
            amount_water: '800ml',
            height: 102,
            weight: 17.5,
          },
          {
            key: 12,
            name: 'Trần Thùy Linh',
            birthDay: '16/10/2017',
            age: 50,
            class: 'Preschool',
            date: '15/08/2018',
            father_name: 'Trần Đức Hải',
            mother_name: 'Lê Thị Ngọc Sương',
            amount_water: '700ml',
            height: 107,
            weight: 11,
          },
          {
            key: 13,
            name: 'Nguyễn Thị Minh Nguyệt',
            birthDay: '08/05/2017',
            age: 55,
            class: 'Preschool',
            date: '17/09/2018',
            father_name: 'Nguyễn Văn Hùng',
            mother_name: 'Trần Ngọc Ánh',
            amount_water: '800ml',
            height: 105,
            weight: 12,
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
    branches: [],
    classes: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state }),
  },
  effects: {},
  subscriptions: {},
};

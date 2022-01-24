  export default {
    namespace: 'OPListOfficialStudent',
    state: {
      data: [
        {
          id: 1,
          nameStudent: "Nguyễn Thị Lệ Đáng",
          birthDayStudent: "20/10/1999",
          age:"24",
          sex:"Nữ",
          nameParents:"Nguyễn Văn Đáng",
          phoneParents:"0349624626",
          nameM:"Nguyễn Thị Tâm",
          phoneM:"302616562",
          basic:"Scenic Valley 2",
          class:"Preschool 1",
          time:"06/12/2021",
          status:"APPLY",
        },
        {
          id: 2,
          nameStudent: "Bùi Hoàng Quân",
          birthDayStudent: "20/10/1999",
          age:"24",
          sex:"Nữ",
          nameParents:"Bùi Ngọc Thy Nhân",
          phoneParents:"0349624626",
          nameM:"Nguyễn Thị Tâm",
          phoneM:"302616562",
          basic:"Scenic Valley 2",
          class:"Preschool 1",
          time:"06/12/2021",
          status:"APPLY",
        },
        {
          id: 3,
          nameStudent: "Bùi Hoàng Quân",
          birthDayStudent: "20/10/1999",
          age:"24",
          sex:"Nữ",
          nameParents:"Đinh Minh An",
          phoneParents:"0349624626",
          nameM:"Nguyễn Thị Tâm",
          phoneM:"302616562",
          basic:"Scenic Valley 2",
          class:"Preschool 1",
          time:"06/12/2021",
          status:"APPLY",
        }
      ],
      city: [],
      district: [],
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
  
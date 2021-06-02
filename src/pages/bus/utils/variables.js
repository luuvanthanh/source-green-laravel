export const variables = {
  STATUS: {
    NOT_YET_GOING: 'NOT_YET_GOING',
    GOT_IN_BUS: 'GOT_IN_BUS',
    GOT_OFF_BUS: 'GOT_OFF_BUS',
    NO_ARRIVE_STATION: 'NO_ARRIVE_STATION',
  },
  STATUS_NAME: {
    NOT_YET_GOING: 'Chưa khởi hành',
    GOT_IN_BUS: 'Lên xe',
    GOT_OFF_BUS: 'Xuống xe',
    NO_ARRIVE_STATION: 'Chưa đến trạm bus',
  },
  STATUS_BUS: [
    {
      value: 'NOT_YET_GOING',
      label: 'Chưa khởi hành',
    },
    {
      value: 'GOT_IN_BUS',
      label: 'Lên xe',
    },
    {
      value: 'GOT_OFF_BUS',
      label: 'Xuống xe',
    },
  ],
  TABS: [
    { id: 'SCHOOLWARD', name: 'Đón trẻ' },
    { id: 'HOMEAWARD', name: 'Trả trẻ' },
  ],
  STATUS_TABS: {
    SCHOOLWARD: 'SCHOOLWARD',
    HOMEAWARD: 'HOMEAWARD',
  },
  DAY_OF_WEEK: {
    Monday: 'mo',
    Tuesday: 'tu',
    Wednesday: 'we',
    Thursday: 'th',
    Friday: 'fr',
    Saturday: 'sa',
    Sunday: 'su',
  },
  DAY_OF_WEEK_NUMBER: {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    0: 'Sunday',
  },
  DAYS: [
    { id: 'Monday', name: 'Thứ hai' },
    { id: 'Tuesday', name: 'Thứ ba' },
    { id: 'Wednesday', name: 'Thứ tư' },
    { id: 'Thursday', name: 'Thứ năm' },
    { id: 'Friday', name: 'Thứ sáu' },
    { id: 'Saturday', name: 'Thứ bảy' },
    { id: 'Sunday', name: 'Chủ nhật' },
  ],
};

export default variables;

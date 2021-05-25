export const variables = {
  TABS: [
    { id: 'overview', name: 'Tổng quan' },
    { id: 'warning', name: 'Cảnh báo' },
    { id: 'activity', name: 'Hoạt động' },
    { id: 'student', name: 'Học sinh' },
    { id: 'application', name: 'Ứng dụng' },
  ],
  NOTE: [
    { id: 'CONFIRMING', name: 'Chưa nhận' },
    { id: 'CONFIRMED', name: 'Đã nhận' },
  ],
  STATUS_NOTE: [
    {
      id: '',
      name: 'Tất cả trạng thái'
    },
    {
      id: 'CONFIRMING',
      name: 'Chờ xác nhận',
    },
    {
      id: 'CONFIRMED',
      name: 'Đã nhận',
    },
  ],
  MEDICAL: [
    { id: 'PENDING', name: 'Chưa nhận' },
    { id: 'RECEIVED', name: 'Đã nhận' },
    { id: 'PROCESSED', name: 'Hoàn thành' },
  ],
  DATA_MEDICAL: [
    {
      id: '1',
      name: 'Su Beo',
      description: 'Bệnh Ho',
      date: '15:30, 16/05'
    },
    {
      id: '2',
      name: 'Vân Khánh',
      description: 'Bệnh xổ mũi',
      date: '15:30, 16/05'
    },
    {
      id: '3',
      name: 'Trần Tùng',
      description: 'Bệnh đỏ mắt',
      date: '15:30, 16/05'
    },
    {
      id: '4',
      name: 'Quốc Bảo',
      description: 'Bệnh ho',
      date: '15:30, 16/05'
    },
    {
      id: '5',
      name: 'Như Hưng',
      description: 'Bệnh bầm da',
      date: '15:30, 16/05'
    }
  ],
  DATA_BUS: [
    {
      id: '1',
      name: 'Số trẻ đăng ký xe bus',
      number: '56'
    },
    {
      id: '2',
      name: 'Đón trẻ lên xe',
      number: '56'
    },
    {
      id: '3',
      name: 'Đón trẻ xuống xe',
      number: '56'
    },
    {
      id: '4',
      name: 'Trả trẻ lên xe',
      number: '56'
    },
    {
      id: '5',
      name: 'Trả trẻ xuống xe',
      number: '56'
    }
  ],
  ATTENDANCE: [
    {
      id: 'QUANTITY',
      name: 'Sỉ số trẻ',
      number: '150'
    },
    {
      id: 'CHILDREN_IN_CLASS',
      name: 'Điểm danh vào lớp',
      number: '143'
    },
    {
      id: 'UNPAID_LEAVE',
      name: 'Vắng không phép',
      number: '15'
    },
    {
      id: 'ANNUAL_LEAVE',
      name: 'Vắng có phép',
      number: '13'
    }
  ],
  MENU: [
    {
      id: 'bus',
      name: 'Bus',
      image: '/images/home/road.svg'
    },
    {
      id: 'childrenInClass',
      name: 'Trẻ vào lớp',
      image: '/images/home/note.svg',
    },
    {
      id: 'health',
      name: 'Sức khỏe',
      image: '/images/home/tumblr.svg',
    },
    {
      id: 'note',
      name: 'Ghi chú',
      image: '/images/home/pages.svg',
    },
    {
      id: 'medical',
      name: 'Y tế',
      image: '/images/home/balloons.svg',
    },
    {
      id: 'programStudy',
      name: 'Chương trình học',
      image: '/images/home/spreadsheet.svg',
    },
  ],
  TABS_BUS: [
    { id: 'SCHOOLWARD', name: 'Đón trẻ' },
    { id: 'HOMEAWARD', name: 'Trả trẻ' },
  ],
  TABS_HEALTH: [
    { id: 'everyDay', name: 'Thường nhật' },
    { id: 'chart', name: 'Biểu đồ thống kê' },
    { id: 'history', name: 'Lịch sử nhập' },
  ],
};

export default variables;

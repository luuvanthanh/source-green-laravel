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
  DATA_NOTES: [
    {
      id: '1',
      name: 'Su Beo',
      description: 'Giữ ấm cho bé',
      date: '15:30, 16/05'
    },
    {
      id: '2',
      name: 'Vân Khánh',
      description: 'Quàng khăn cổ cho bé',
      date: '15:30, 16/05'
    },
    {
      id: '3',
      name: 'Trần Tùng',
      description: 'Cho bé uống nước nhiều',
      date: '15:30, 16/05'
    },
    {
      id: '4',
      name: 'Quốc Bảo',
      description: 'Cho bé uống nước nhiều',
      date: '15:30, 16/05'
    },
    {
      id: '5',
      name: 'Như Hưng',
      description: 'Cho bé uống nước nhiều',
      date: '15:30, 16/05'
    }
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
  HEALTHS: [
    {
      id: '1',
      name: 'Số lần pipi',
      description: 'Bé thường xuyên đi pipi mặc dù uống ít nước',
      status: '3',
    },
    {
      id: '2',
      name: 'Ăn sáng',
      description: '',
      status: 'Tốt',
    },
    {
      id: '3',
      name: 'Xế sáng',
      description: '',
      status: 'Tốt',
    },
    {
      id: '4',
      name: 'Số lần pupu',
      description: '',
      status: '1',
    },
    {
      id: '5',
      name: 'Ăn trưa',
      description: '',
      status: 'Tốt',
    },
    {
      id: '6',
      name: 'Xế trưa',
      description: '',
      status: 'Tốt',
    },
    {
      id: '7',
      name: 'Lượng nước uống',
      description: 'Bình 50ml',
      status: '3 bình',
    },
    {
      id: '8',
      name: 'Ngủ trưa',
      description: '',
      status: 'Tốt',
    },
    {
      id: '9',
      name: 'Xế chiều',
      description: 'Bé không muốn ăn',
      status: 'Khác',
    },
    {
      id: '10',
      name: 'Bữa uống',
      description: '',
      status: 'Tốt',
    },
    {
      id: '11',
      name: 'Bữa ngoài giờ',
      description: '',
      status: 'Tốt',
    },
    {
      id: '12',
      name: 'Tình huống',
      description: 'Bé hay khóc nhè',
      status: '',
    },
  ]
};

export default variables;

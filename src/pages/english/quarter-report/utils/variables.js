import ability from '@/utils/ability';

export const variables = {
  STATUS: {
    NEW: 'NEW',
    CLOSED: 'CLOSED',
    EXPIRE: 'EXPIRE',
    VALIDATING: 'VALIDATING',
    IN_PROGRESS: 'IN_PROGRESS',
    SENT: 'SENT',
    CONFIRMING: 'CONFIRMING',
    CONFIRMED: 'CONFIRMED',
    NOT_REVIEW: 'NOT_REVIEW',
    REVIEWED: 'REVIEWED',
    NOT_YET_CONFIRM: 'NOT_YET_CONFIRM',
    NOT_YET_SEND: 'NOT_YET_SEND',
    DONE_REVIEW: 'NOT_REVIEW',
    DONE_CONFIRM: 'DONE_CONFIRM',
  },
  STATUS_NAME: {
    IN_PROGRESS: 'Đang trao đổi',
    CLOSED: 'Đã xác nhận',
    VALIDATING: 'Đang xác nhận',
    NEW: 'Mới',
    EXPIRE: 'Hết hạn',
    CONFIRMING: 'Chờ xác nhận',
    NOT_REVIEW: 'NOT YET REVIEW',
    REVIEWED: 'DONE REVIEW',
    NOT_YET_CONFIRM: 'NOT YET CONFIRM',
    CONFIRMED: 'DONE CONFIRM',
    NOT_YET_SEND: 'NOT YET SEND',
    SENT: 'DONE SEND',
  },
  STATUS_TABS: [
    ...(ability.can(
      'WEB_TIENGANH_DANHGIADINHKY_CHUADANHGIA_VIEW',
      'WEB_TIENGANH_DANHGIADINHKY_CHUADANHGIA_VIEW',
    )
      ? [
          {
            id: 'NOT_REVIEW',
            name: 'NOT YET REVIEW',
            type: 'quantityNotYetReview',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_TIENGANH_DANHGIADINHKY_DADANHGIA_VIEW',
      'WEB_TIENGANH_DANHGIADINHKY_DADANHGIA_VIEW',
    )
      ? [
          {
            id: 'REVIEWED',
            name: 'DONE REVIEW',
            type: 'quantityDoneReview',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_TIENGANH_DANHGIADINHKY_CHUADUYET_VIEW',
      'WEB_TIENGANH_DANHGIADINHKY_CHUADUYET_VIEW',
    )
      ? [
          {
            id: 'NOT_YET_CONFIRM',
            name: 'NOT YET CONFIRM',
            type: 'quantityNotYetConfirm',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_TIENGANH_DANHGIADINHKY_DADUYET_VIEW',
      'WEB_TIENGANH_DANHGIADINHKY_DADUYET_VIEW',
    )
      ? [
          {
            id: 'CONFIRMED',
            name: 'DONE CONFIRM',
            type: 'quantityDoneConfirm',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_TIENGANH_DANHGIADINHKY_CHUAGUI_VIEW',
      'WEB_TIENGANH_DANHGIADINHKY_CHUAGUI_VIEW',
    )
      ? [
          {
            id: 'NOT_YET_SEND',
            name: 'NOT YET SEND',
            type: 'quantityNotYetSend',
          },
        ]
      : []),
    ...(ability.can(
      'WEB_TIENGANH_DANHGIADINHKY_DAGUI_VIEW',
      'WEB_TIENGANH_DANHGIADINHKY_DAGUI_VIEW',
    )
      ? [
          {
            id: 'SENT',
            name: 'DONE SEND',
            type: 'quantityDoneSend',
          },
        ]
      : []),
  ],
  // STATUS_TABS: [
  //   {
  //     id: 'NOT_REVIEW',
  //     name: 'NOT YET REVIEW',
  //     type: 'quantityNotYetReview',
  //   },
  //   {
  //     id: 'REVIEWED',
  //     name: 'DONE REVIEW',
  //     type: 'quantityDoneReview',
  //   },
  //   {
  //     id: 'NOT_YET_CONFIRM',
  //     name: 'NOT YET CONFIRM',
  //     type: 'quantityNotYetConfirm',
  //   },
  //   {
  //     id: 'CONFIRMED',
  //     name: 'DONE CONFIRM',
  //     type: 'quantityDoneConfirm',
  //   },
  //   {
  //     id: 'NOT_YET_SEND',
  //     name: 'NOT YET SEND',
  //     type: 'quantityNotYetSend',
  //   },
  //   {
  //     id: 'SENT',
  //     name: 'DONE SEND',
  //     type: 'quantityDoneSend',
  //   },
  // ],
  STATUS_SEARCH: {
    NOT_YET_CONFIRM: 'NOT_YET_CONFIRM',
    NOT_YET_SEND: 'CONFIRMED',
    NOT_REVIEW: 'NOT_REVIEW',
    CONFIRMED: 'CONFIRMED',
    REVIEWED: 'REVIEWED',
    SENT: 'SENT',
  },
  STATUS_SEARCH_TYPE: {
    REVIEWED: 'DONE_REVIEW',
    CONFIRMED: 'DONE_CONFIRM',
  },
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
  NAME_ROLES: {
    TEACHER: 'Giáo viên',
    PARENT: 'Phụ huynh',
  },
};

export default variables;

import ability from '@/utils/ability';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

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
    PENDING_APPROVED: 'PENDING_APPROVED',
    APPROVED: 'APPROVED',
  },
  STATUS_NAME: {
    IN_PROGRESS: 'Đang trao đổi',
    CLOSED: 'Đã xác nhận',
    VALIDATING: 'Đang xác nhận',
    NEW: 'Mới',
    EXPIRE: 'Hết hạn',
    CONFIRMING: 'Chờ xác nhận',
    CONFIRMED: 'Đã nhận',
  },
  STATUS_TABS: [
    ...(ability.can(
      `${FLATFORM.WEB}${permissions.SPTCT_DANHGIADADUYET_CHOGUI}${ACTION.VIEW}`,
      `${FLATFORM.WEB}${permissions.SPTCT_DANHGIADADUYET_CHOGUI}${ACTION.VIEW}`,
    )
      ? [
        {
          id: 'PENDING_APPROVED',
          name: 'Chờ gửi',
        },
        ]
      : []),
      ...(ability.can(
        `${FLATFORM.WEB}${permissions.SPTCT_DANHGIADADUYET_DAGUI}${ACTION.VIEW}`,
        `${FLATFORM.WEB}${permissions.SPTCT_DANHGIADADUYET_DAGUI}${ACTION.VIEW}`,
      )
        ? [
          {
            id: 'APPROVED',
            name: 'Đã gửi',
          },
          ]
        : []),
  ],
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
  NAME_ROLES: {
    TEACHER: 'Giáo viên',
    PARENT: 'Phụ huynh',
  },
};

export default variables;

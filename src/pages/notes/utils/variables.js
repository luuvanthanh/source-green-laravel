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
      `${FLATFORM.WEB}${permissions.DANDO_DANHSACH_CHOXACNHAN}${ACTION.VIEW}`,
      `${FLATFORM.WEB}${permissions.DANDO_DANHSACH_CHOXACNHAN}${ACTION.VIEW}`,
    )
      ? [
          {
            id: 'CONFIRMING',
            name: 'Chờ xác nhận',
          },
        ]
      : []),
    ...(ability.can(
      `${FLATFORM.WEB}${permissions.DANDO_DANHSACH_DANHAN}${ACTION.VIEW}`,
      `${FLATFORM.WEB}${permissions.DANDO_DANHSACH_DANHAN}${ACTION.VIEW}`,
    )
      ? [
          {
            id: 'CONFIRMED',
            name: 'Đã nhận',
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

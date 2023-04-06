import ability from '@/utils/ability';
import { permissions, FLATFORM, ACTION } from '@/../config/permissions';

export const variables = {
  STATUS: {
    PENDING_APPROVED: 'PENDING_APPROVED',
    APPROVED: 'APPROVED',
    NOT_SEND: 'NOT_SEND',
    SEND: 'SEND',
  },
  STATUS_NAME: {
    NOT_SEND: 'Chưa gửi',
    SEND: 'Đã gửi',
  },
  STATUS_TABS: [
    ...(ability.can(
      `${FLATFORM.WEB}${permissions.CTH_HOCTAPGIAOCU_HOCSINHCOTKNC_CHOGUI}${ACTION.VIEW}`,
      `${FLATFORM.WEB}${permissions.CTH_HOCTAPGIAOCU_HOCSINHCOTKNC_CHOGUI}${ACTION.VIEW}`,
    )
      ? [
        {
          id: 'PENDING_APPROVED',
          name: 'Chờ gửi',
          type: 'not_send',
        },
        ]
      : []),
    ...(ability.can(
      `${FLATFORM.WEB}${permissions.CTH_HOCTAPGIAOCU_HOCSINHCOTKNC_DAGUI}${ACTION.VIEW}`,
      `${FLATFORM.WEB}${permissions.CTH_HOCTAPGIAOCU_HOCSINHCOTKNC_DAGUI}${ACTION.VIEW}`,
    )
      ? [
        {
          id: 'APPROVED',
          name: 'Đã gửi',
          type: 'send',
        },
        ]
      : []),
  ],
};

export default variables;

import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import Can from '@/utils/Can';
import styles from './styles.module.scss';

const ICON_BUTTON = {
  plus: <span className="icon-plus-circle" />,
  edit: <span className="icon-edit" />,
  send: <span className="icon-send" />,
  ellipsis: <span className="icon-ellipsis" />,
  save: <span className="icon-save" />,
  upload1: <span className="icon-upload1" />,
  remove: <span className="icon-remove" />,
  prev: <span className="icon-prev" />,
  plusMain: <span className="icon-plus" />,
  eye: <span className="icon-eye" />,
  cross: <span className="icon-cross" />,
  up: <span className="icon-up" />,
  export: <span className="icon-export" />,
  search: <span className="icon-search" />,
  project: <span className="icon-project" />,
  printer: <span className="icon-printer" />,
  checkCircle: <span className="icon-check-circle" />,
  plan: <span className="icon-plan" />,
  checkmark: <span className="icon-checkmark" />,
  cancel: <span className="icon-cancel" />,
  phone: <span className="icon-phone" />,
  cloud: <span className="icon-cloud" />,
  cloudUpload: <span className="icon-cloud" />,
  cloudDownload: <span className="icon-cloud" />,
  copy: <span className="icon-copy" />,
  shrink: <span className="icon-shrink" />,
  list: <span className="icon-list" />,
  comeback: <span className="icon-arrow-left2" />,
  facebook: <span className="icon-facebook" />,
  envelop: <span className="icon-envelop" />,
  addMail: <span className="icon-envelop" />,
  telephone: <span className="icon-telephone" />,
  schedules: <span className="icon-schedules" />,
  file: <span className="icon-file-text" />,
  circle: <span className="icon-circle-right" />,
  equalizer: <span className="icon-equalizer" />,
  sphere: <span className="icon-sphere" />,
  mobile: <span className="icon-mobile" />,
  'add-file-plus': <span className="icon-add-file-plus" />,
  'calendar-plus': <span className="icon-calendar-plus" />,
  'phone-plus': <span className="icon-phone-plus" />,
  'email-plus': <span className="icon-email-plus" />,
  next: <span className="icon-next" />,
  'arrow-right2': <span className="icon-arrow-right2" />,
  'arrow-left': <span className="icon-arrow-left" />,
  report: <span className="icon-report" />,
  'cloud-upload': <span className="icon-cloud-upload" />,
  redo2: <span className="icon-redo2" />,
  excel: <span className="icon-excel" />,
  accept: <span className="icon-accept" />,
};
export default function ButtonCustom({
  children,
  ghost,
  icon,
  color,
  size,
  className,
  permission,
  ...rest
}) {
  if (children) {
    return (
      <Can a={permission} I={permission} passThrough={!permission}>
        <Button
          {...rest}
          className={classnames(
            'd-flex',
            'justify-content-center',
            'align-items-center',
            styles.button,
            styles[`${color}`],
            styles[`size-${size}`],
            {
              [styles.ghost]: ghost,
            },
            className,
          )}
        >
          {color && ICON_BUTTON[icon]}
          {children}
        </Button>
      </Can>
    );
  }
  return (
    <Can a={permission} I={permission} passThrough={!permission}>
      <Button
        {...rest}
        className={classnames(
          'd-flex',
          'justify-content-center',
          'align-items-center',
          styles.button,
          styles.notChildren,
          styles[`${color}`],
          styles[`size-${size}`],
          {
            [styles.ghost]: ghost,
          },
          className,
        )}
      >
        {ICON_BUTTON[icon]}
      </Button>
    </Can>
  );
}

ButtonCustom.propTypes = {
  children: PropTypes.any,
  color: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
  action: PropTypes.string,
  subject: PropTypes.string,
  className: PropTypes.string,
  permission: PropTypes.any,
  ghost: PropTypes.any,
};

ButtonCustom.defaultProps = {
  children: '',
  color: 'dark',
  icon: '',
  size: '',
  action: '',
  subject: '',
  className: '',
  permission: null,
  ghost: false,
};

ButtonCustom.displayName = 'Button';

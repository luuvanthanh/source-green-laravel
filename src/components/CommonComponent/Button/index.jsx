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
};
export default function ButtonCustom({
  children,
  ghost,
  icon,
  color,
  size,
  action,
  subject,
  isPermission,
  className,
  ...rest
}) {
  if (children) {
    return (
      <Can a={action} I={subject} passThrough={!isPermission}>
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
              [styles.ghost]: ghost
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
    <Can a={action} I={subject} passThrough={!isPermission}>
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
            [styles.ghost]: ghost
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
  isPermission: PropTypes.bool,
  className: PropTypes.string,
};

ButtonCustom.defaultProps = {
  children: '',
  color: 'dark',
  icon: '',
  size: '',
  action: '',
  subject: '',
  isPermission: false,
  className: '',
};

ButtonCustom.displayName = 'Button';

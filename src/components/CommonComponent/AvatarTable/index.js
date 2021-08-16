import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import styles from './styles.module.scss';

class AvatarTable extends Component {
  render() {
    const {
      fileImage,
      size,
      fullName,
      description,
      className,
      shape,
      srcLocal,
      isActive,
    } = this.props;
    if (fileImage && fullName) {
      return (
        <div className={classnames(styles['avatar-container'], styles[className])}>
          <div className="container-image">
            <div
              className="background-avatar"
              style={{
                backgroundImage: `url(${srcLocal ? '' : API_UPLOAD}${fileImage})`,
                borderRadius: shape === 'circle' ? '50%' : '4px',
              }}
            />
            <Avatar
              shape={shape}
              size={size || 40}
              src={`${srcLocal ? '' : API_UPLOAD}${fileImage}`}
            />
            {isActive && (
              <div className={styles.notification}>
                <span className="icon-checkmark" />
              </div>
            )}
          </div>
          {fullName && description && (
            <div className={classnames(styles.info, { [`${styles.active}`]: isActive })}>
              <p className={styles.title}>{fullName}</p>
              <p className={styles.norm}>{description}</p>
            </div>
          )}
          {fullName && !description && (
            <div className={classnames(styles.info, { [`${styles.active}`]: isActive })}>
              <p className={styles.name}>{fullName}</p>
            </div>
          )}
        </div>
      );
    }
    if (!fileImage && fullName) {
      return (
        <div
          className={classnames(
            styles['avatar-container'],
            `${className ? styles[`${className}`] : ''}`,
          )}
        >
          <div className="container-image">
            <div
              className="background-avatar"
              style={{
                borderRadius: shape === 'circle' ? '50%' : '4px',
              }}
            />
            <Avatar size={size || 40} shape={shape} icon={<UserOutlined />} />
            {isActive && (
              <div className={styles.notification}>
                <span className="icon-checkmark" />
              </div>
            )}
          </div>
          {fullName && description && (
            <div className={styles.info}>
              <p className={styles.title}>{fullName}</p>
              <p className={styles.norm}>{description}</p>
            </div>
          )}
          {fullName && !description && (
            <div className={styles.info}>
              <p className={styles.name}>{fullName}</p>
            </div>
          )}
        </div>
      );
    }
    if (fileImage && !fullName) {
      return (
        <div className="container-image">
          <div
            className="background-avatar"
            style={{
              backgroundImage: `url(${srcLocal ? '' : API_UPLOAD}${fileImage})`,
              borderRadius: shape === 'circle' ? '50%' : '4px',
            }}
          />
          <Avatar
            shape={shape}
            size={size || 40}
            src={`${srcLocal ? '' : API_UPLOAD}${fileImage}`}
          />
          {isActive && (
            <div className={styles.notification}>
              <span className="icon-checkmark" />
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="container-image">
        <div
          className="background-avatar"
          style={{
            borderRadius: shape === 'circle' ? '50%' : '4px',
          }}
        />
        <Avatar size={size || 40} shape={shape} icon={<UserOutlined />} />
        {isActive && (
          <div className={styles.notification}>
            <span className="icon-checkmark" />
          </div>
        )}
      </div>
    );
  }
}

AvatarTable.propTypes = {
  size: PropTypes.number,
  fullName: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  fileImage: PropTypes.any,
  shape: PropTypes.string,
  srcLocal: PropTypes.bool,
  isActive: PropTypes.bool,
};
AvatarTable.defaultProps = {
  size: 40,
  fullName: '',
  description: '',
  className: '',
  fileImage: '',
  shape: 'square',
  srcLocal: false,
  isActive: false,
};

export default AvatarTable;

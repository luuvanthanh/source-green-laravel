import { Avatar, Image } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Helper } from '@/utils';
import { isEmpty } from 'lodash';
import styles from './styles.module.scss';

class ImgDetail extends Component {
  render() {
    const { fileImage, shape, type } = this.props;

    if (type === 'object' && !isEmpty(fileImage)) {
      return (
        <div>
          <Image
            className={classnames(styles['img-container'])}
            src={`${API_UPLOAD}${fileImage}`}
          />
        </div>
      );
    }
    if (Helper.isJSON(fileImage)) {
      if (JSON?.parse(fileImage)?.length > 0) {
        return (
          <div>
            {JSON.parse(fileImage).map((item, index) => (
              <Image
                key={index}
                className={classnames(styles['img-container'])}
                src={`${API_UPLOAD}${item}`}
              />
            ))}
          </div>
        );
      }
      return (
        <div className={classnames(styles['container-image'])}>
          <div
            className={classnames(styles['background-avatar'])}
            style={{
              borderRadius: shape === 'circle' ? '50%' : '4px',
            }}
          />
          <Avatar shape={shape} icon={<UserOutlined />} className={styles?.avt} />
        </div>
      );
    }
    return (
      <div className={classnames(styles['container-image'])}>
        <div
          className={classnames(styles['background-avatar'])}
          style={{
            borderRadius: shape === 'circle' ? '50%' : '4px',
          }}
        />
        <Avatar shape={shape} icon={<UserOutlined />} className={styles?.avt} />
      </div>
    );
  }
}

ImgDetail.propTypes = {
  fileImage: PropTypes.any,
  shape: PropTypes.string,
  type: PropTypes.string,
};
ImgDetail.defaultProps = {
  fileImage: '',
  shape: 'square',
  type: '',
};

export default ImgDetail;

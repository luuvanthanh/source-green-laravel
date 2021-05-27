import React, { PureComponent } from 'react';
import { connect } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Slider from 'react-slick';

import { variables } from '@/utils';
import { isValidCondition } from '@/utils/authority';
import feature from '@/services/feature';
import ItemSlider from './itemSlider';

import styles from './index.scss';

@connect(({ user, loading }) => ({ user, loading }))

class Application extends PureComponent {
  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
      data: feature.FEATURES.filter((menuItem) => {
        const showMenu = isValidCondition({
          conditions: [
            {
              permission: menuItem.permission || [''],
              isOrPermission: true,
            },
          ],
          userPermission: [
            variables.ROLES_PERMISSIONS.includes(user?.user?.role?.toUpperCase())
              ? user?.user?.role?.toUpperCase()
              : variables.ROLES.ALL,
          ],
        });
        return showMenu;
      }),
    };
  }

  render() {
    const { data } = this.state;
    const settings = {
      arrows: false,
      dots: true,
      slidesPerRow: 7,
      rows: 3,
      responsive: [
        {
          breakpoint: 1666,
          settings: {
            slidesPerRow: 6,
            rows: 3,
          },
        },
        {
          breakpoint: 1366,
          settings: {
            slidesPerRow: 5,
            rows: 3,
          },
        },
        {
          breakpoint: 1080,
          settings: {
            slidesPerRow: 4,
            rows: 3,
          },
        },
        {
          breakpoint: 880,
          settings: {
            slidesPerRow: 3,
            rows: 3,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesPerRow: 2,
            rows: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesPerRow: 2,
            rows: 3,
          },
        },
        {
          breakpoint: 375,
          settings: {
            slidesPerRow: 1,
            rows: 3,
          },
        },
      ],
    };

    return (
      <div className={classnames(styles['items-container'])}>
        <Slider {...settings}>
          {data.map((item, index) => (
            <div key={index}>
              <ItemSlider {...item} />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

Application.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

Application.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
  user: {},
};

export default Application;

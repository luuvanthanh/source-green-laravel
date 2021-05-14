import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect, Link } from 'umi';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './index.scss';
import Slider from 'react-slick';
import { variables } from '@/utils';
import { isValidCondition } from '@/utils/authority';
import feature from '@/services/feature';

@connect(({ user, loading }) => ({ user, loading }))
class Index extends PureComponent {
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
    const {
      loading: { effects },
    } = this.props;
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
      <div className={styles.block}>
        <Helmet title="Trang Chủ" />
        <div className={classnames(styles['items-container'])}>
          <Slider {...settings}>
            {data.map((item, index) => (
              <div key={index}>
                {item.target && (
                  <a href={item.url} target="_blank" className={styles.item}>
                    <div className={styles['item-image']}>
                      <img src={item.src} alt="notification" className={styles.icon} />
                    </div>
                    <div className={styles['item-content']}>
                      <p className={styles['norm']}>{item.title}</p>
                    </div>
                  </a>
                )}
                {!item.target && (
                  <Link to={item.url} className={styles.item}>
                    <div className={styles['item-image']}>
                      <img src={item.src} alt="notification" className={styles.icon} />
                    </div>
                    <div className={styles['item-content']}>
                      <p className={styles['norm']}>{item.title}</p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default Index;

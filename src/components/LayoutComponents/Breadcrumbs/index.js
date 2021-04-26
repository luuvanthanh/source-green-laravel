import React from 'react';
import { connect, Link, withRouter } from 'umi';
import { reduce, isArray } from 'lodash';
import styles from './style.module.scss';
import validator from 'validator';

const mapStateToProps = ({ menu }) => ({
  menuLeftData: menu.menuLeftExchange,
});

@withRouter
@connect(mapStateToProps)
class Breadcrumbs extends React.Component {
  state = {
    breadcrumb: [],
  };

  componentDidMount() {
    this.setBreadcrumbs(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setBreadcrumbs(newProps);
  }

  setBreadcrumbs = (props) => {
    const { menu, menuLeftData } = this.props;
    this.setState({
      breadcrumb: this.getBreadcrumb(props, menu || menuLeftData),
    });
  };

  getPath(data, url, parents = []) {
    const items = reduce(
      data,
      (result, entry) => {
        if (result?.length) {
          return result;
        }
        if (entry.url === url) {
          return [entry].concat(parents);
        }

        if (isArray(entry.url) && entry.url.find((item) => item === this.convertPathname(url))) {
          return [entry].concat(parents);
        }

        if (entry.children) {
          const nested = this.getPath(entry.children, url, [entry].concat(parents));
          return (result || []).concat(nested.filter((e) => !!e));
        }
        return result;
      },
      [],
    );
    return items?.length > 0 ? items : [false];
  }

  convertPathname = (pathname) => {
    if (pathname) {
      const listItemPath = pathname.split('/');
      return listItemPath
        .map((item, index) => {
          return validator.isUUID(item) || Number.parseInt(item, 10) ? ':id' : item;
        })
        .join('/');
    }
    return '';
  };

  getBreadcrumb = (props, items) => {
    const [activeMenuItem, ...path] = this.getPath(items, props.location.pathname);
    if (activeMenuItem && path?.length) {
      return path.reverse().map((item, index) => {
        if (index === path?.length - 1) {
          return (
            <span key={item.key}>
              <span className={`${styles.arrow} text-muted`} />
              <span className="text-muted">{item.title}</span>
              <span className={styles.arrow} />
              <strong className={styles.title}>{activeMenuItem.title}</strong>
            </span>
          );
        }
        return (
          <span key={item.key}>
            <span className={`${styles.arrow} text-muted`} />
            <span className="text-muted">{item.title}</span>
          </span>
        );
      });
    }
    return (
      <span>
        <span className={styles.arrow} />
        <strong className={styles.title}>{activeMenuItem.title}</strong>
      </span>
    );
  };

  render() {
    const { breadcrumb } = this.state;
    const { last, className } = this.props;
    return (
      <div className={`${styles.breadcrumbs} ${className}`} >
        <div className={styles.path}>
          <Link className="text-muted" to="/">
            Trang chủ
          </Link>
          {breadcrumb}
          {last && (
            <span>
              <span className={`${styles.arrow} text-muted`} />
              <strong className={styles.title}>{last}</strong>
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default Breadcrumbs;

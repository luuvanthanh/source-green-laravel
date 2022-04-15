import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Menu, Breadcrumb } from 'antd';
import PropTypes from 'prop-types';
import validator from 'validator';
import { useSelector, useDispatch } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link, history } from 'umi';
import Add from './forms/add';
import PostsForm from './forms/details';
import stylesModule from '../../styles.module.scss';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <Add />,
  posts: <PostsForm />,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem] = useState(defaultKey);

  const dispatch = useDispatch();
  const [check, setCheck] = useState(false);

  const { detailsAddPost } = useSelector(({ crmMarketingManageAdd }) => ({
    detailsAddPost: crmMarketingManageAdd.detailsAddPost,
  }));


  const convertPathname = (pathname) => {
    if (pathname) {
      const listItemPath = pathname.split('/');
      return listItemPath
        .map((item) => (validator.isUUID(item) || Number.parseInt(item, 10) ? ':id' : item))
        .join('/');
    }
    return '';
  };

  useEffect(() => {
    setCheck(false);
    if (convertPathname(pathname) === '/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/:id/chi-tiet-bai-viet') {
      setCheck(true);
      dispatch({
        type: 'crmMarketingManageAdd/GET_DETAILS_POSTS',
        payload: params,
        callback() { },
      });
    }
  }, [pathname]);

  return (
    <div style={{ padding: 20 }}>
      <Helmet title="Quản lý chiến dịch marketing" />
      {check ?
        <Breadcrumb separator=">" className={stylesModule['wrapper-breadcrumb']} style={{ paddingBottom: 20 }}>
          <Breadcrumb.Item>
            <Link to="/crm/tiep-thi/quan-ly-chien-dich-marketing" className={stylesModule.details}>
              Quản lý chiến dịch marketing
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              to={`/crm/tiep-thi/quan-ly-chien-dich-marketing/${detailsAddPost?.marketing_program_id}/chi-tiet?type=posts`}
              className={stylesModule.details}
            >
              Danh sách bài viết
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              className={stylesModule.details}
            >
              {detailsAddPost?.name}
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        : <Breadcrumb separator=">" className={stylesModule['wrapper-breadcrumb']} style={{ paddingBottom: 20 }}>
          <Breadcrumb.Item>
            <Link to="/crm/tiep-thi/quan-ly-chien-dich-marketing" className={stylesModule.details}>
              Quản lý chiến dịch marketing
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              onClick={() => history.goBack()}
              className={stylesModule.details}
            >
              Danh sách bài viết
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              className={stylesModule.details}
            >
              Tạo mới bài viết
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
      }
      <div className="row">
        <div className="col-lg-3">
          <div className="card">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 200}>
              <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
                {check &&
                  menu
                    .filter((item) => item.key)
                    .map(({ key, label }) => (
                      <MenuItem key={key}>
                        <Link to={`${pathname}?type=${key}`}>{label}</Link>
                      </MenuItem>
                    ))}
                {!check &&
                  menu
                    .filter((item) => item.key === 'general')
                    .map(({ key, label }) => (
                      <MenuItem key={key}>
                        <Link to={`${pathname}?type=${key}`}>{label}</Link>
                      </MenuItem>
                    ))}
              </Menu>
            </Scrollbars>
          </div>
        </div>
        <div className="col-lg-9">{forms[query.type || defaultKey]}</div>
      </div>
    </div>
  );
});

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  location: {},
};

export default Index;

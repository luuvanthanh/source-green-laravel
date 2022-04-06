import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import validator from 'validator';
import { useSelector, useDispatch } from 'dva';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'umi';
import Add from './forms/add';
import PostsForm from './forms/details';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <Add />,
  posts: <PostsForm />,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem] = useState(defaultKey);

  const dispatch = useDispatch();
  const [{ menuLeftCRM }] = useSelector(({ menu }) => [menu]);

  const { detailsAddPost } = useSelector(({ crmMarketingManageAdd }) => ({
    detailsAddPost: crmMarketingManageAdd.detailsAddPost,
  }));
  
  
  const convertPathname = (pathname) => {
    if (pathname) {
      const listItemPath = pathname.split('/');
      return  listItemPath
        .map((item) => (validator.isUUID(item) || Number.parseInt(item, 10) ? ':id' : item))
        .join('/');
      }
      return '';
    };

    useEffect(() => {
      if ( convertPathname(pathname) === '/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/:id/chi-tiet-bai-viet' ) {
        dispatch({
          type: 'crmMarketingManageAdd/GET_DETAILS_POSTS',
          payload: params,
          callback(){},
        });
      }
    }, [pathname]);

  return (
    <div style={{ padding: 20 }}>
      <Helmet title="Quản lý chiến dịch marketing" />
      <Breadcrumbs
        className="pb20 pt0 pl0"
        last={detailsAddPost?.id ? `${detailsAddPost?.name}` : 'tạo mới bài viết'}
        menu={menuLeftCRM}
      />
      <div className="row">
        <div className="col-lg-3">
          <div className="card">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 200}>
              <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
                {detailsAddPost.id &&
                  menu
                    .filter((item) => item.key)
                    .map(({ key, label }) => (
                      <MenuItem key={key}>
                        <Link to={`${pathname}?type=${key}`}>{label}</Link>
                      </MenuItem>
                    ))}
                {!detailsAddPost.id &&
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

import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Scrollbars } from 'react-custom-scrollbars';
import { Link } from 'umi';
import GeneralForm from './forms/general';
import PostsForm from './forms/posts';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <GeneralForm />,
  posts: <PostsForm />,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem] = useState(defaultKey);

  const dispatch = useDispatch();
  const [{ menuLeftCRM }] = useSelector(({ menu }) => [menu]);

  const { details } = useSelector(({ crmMarketingManageAdd }) => ({
    details: crmMarketingManageAdd.details,
  }));
  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmMarketingManageAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  return (
    <div style={{ padding: 20 }}>
      <Helmet title="Quản lý chiến dịch marketing" />
      <Breadcrumbs
        className="pb20 pt0 pl0"
        last={params.id ? `${details?.name}` : 'tạo mới'}
        menu={menuLeftCRM}
      />
      <div className="row">
        <div className="col-lg-3">
          <div className="card">
            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 200}>
              <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
                {params.id &&
                  menu
                    .filter((item) => item.key)
                    .map(({ key, label }) => (
                      <MenuItem key={key}>
                        <Link to={`${pathname}?type=${key}`}>{label}</Link>
                      </MenuItem>
                    ))}
                {!params.id &&
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

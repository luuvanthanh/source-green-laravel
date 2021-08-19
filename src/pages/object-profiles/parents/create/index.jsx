import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useSelector, useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { Link } from 'umi';
import GeneralForm from './forms/general';
import CuratorForm from './forms/curator';
import AccountForm from './forms/account';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <GeneralForm />,
  curator: <CuratorForm />,
  account: <AccountForm />,
};

const Index = memo(({ match: { params }, location: { pathname, query } }) => {
  const [activeMenuItem] = useState(defaultKey);
  const dispatch = useDispatch();

  const { details } = useSelector(({ OPParentsAdd }) => ({
    details: OPParentsAdd.details,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPParentsAdd/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  const menuStore = (items) => {
    if (isEmpty(details)) {
      return [];
    }
    if (details?.status === 'STORE') {
      return items.filter((item) => item.key === 'general');
    }
    return items;
  };

  return (
    <Pane style={{ padding: 20 }}>
      <Helmet title="Tạo hồ sơ học sinh" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          {!params.id && <Heading type="page-title">Tạo hồ sơ phụ huynh</Heading>}
          {params.id && (
            <Heading type="page-title">Chi tiết hồ sơ phụ huynh ({details.fullName})</Heading>
          )}
        </Pane>
      </Pane>
      <Pane className="row">
        <Pane className="col-lg-3">
          <Pane className="card">
            <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
              {params.id &&
                menuStore(menu).map(({ key, label }) => (
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
          </Pane>
        </Pane>
        <Pane className="col-lg-9">{forms[query.type || defaultKey]}</Pane>
      </Pane>
    </Pane>
  );
});

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  query: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  location: {},
  query: {},
};

export default Index;

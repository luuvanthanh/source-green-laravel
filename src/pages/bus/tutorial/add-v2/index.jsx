import { memo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Menu } from 'antd';
import { useParams, Link, useLocation } from 'umi';
import { useSelector, useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import GeneralForm from './forms/general';
import BusTransportationsForm from './forms/busTransportations';
import NanniesForm from './forms/nannies';
import BusRouteDriversForm from './forms/busRouteDrivers';

import { menu, defaultKey } from './menu';

const { Item: MenuItem } = Menu;

const forms = {
  general: <GeneralForm />,
  busTransportations: <BusTransportationsForm />,
  nannies: <NanniesForm />,
  busRouteDrivers: <BusRouteDriversForm />,
};

const Index = memo(() => {
  const [activeMenuItem] = useState(defaultKey);
  const dispatch = useDispatch();

  const params = useParams();

  const { query, pathname } = useLocation();

  const [
    loading,
    { details, error },
    menuData,
  ] = useSelector(({ loading: { effects }, tutorialAddV2, menu: { menuLeftVehicel } }) => [
    effects,
    tutorialAddV2,
    menuLeftVehicel,
  ]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'tutorialAddV2/GET_DETAILS',
        payload: params,
      });
    }
  }, [params.id]);

  return (
    <Loading
      loading={loading['tutorialAddV2/GET_DETAILS']}
      isError={error.isError}
      params={{ error }}
    >
      <Breadcrumbs last="Chi tiết lộ trình" menu={menuData} />
      <Pane style={{ padding: '0 20px' }}>
        <Helmet title="Chi tiết lộ trình" />
        <Pane className="row" style={{ marginBottom: 20 }}>
          <Pane className="col">
            {!params.id && <Heading type="page-title">Tạo lộ trình</Heading>}
            {params.id && <Heading type="page-title">Chi tiết lộ trình ({details.name})</Heading>}
          </Pane>
        </Pane>
        <Pane className="row">
          <Pane className="col-lg-3">
            <Pane className="card">
              <Menu selectedKeys={query.type || activeMenuItem} mode="inline">
                {params.id &&
                  menu.map(({ key, label }) => (
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
    </Loading>
  );
});

Index.propTypes = {};

Index.defaultProps = {};

export default Index;

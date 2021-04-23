import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs } from 'antd';
import { useSelector } from 'dva';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';

import styles from '@/assets/styles/Common/information.module.scss';
import commonStyles from '@/assets/styles/Common/common.scss';
import variablesModules from './utils/variables';

import ScheduleTable from './tables/schedule';
import TuitionTable from './tables/tuition';
import FoodTable from './tables/food';
import OtherTable from './tables/other';

const { TabPane } = Tabs;
const tables = {
  schedule: <ScheduleTable />,
  tuition: <TuitionTable />,
  food: <FoodTable />,
  other: <OtherTable />,
};

const Index = memo(() => {
  const mounted = useRef(false);
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  // const dispatch = useDispatch();
  const [{ error, details }, loading] = useSelector(({ loading: { effects }, feePolicyPolicy }) => [
    feePolicyPolicy,
    effects,
  ]);

  const pageLoading = loading[''];

  const [tab, setTab] = useState('schedule');

  const changeTab = (key) => {
    setTab(key);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Loading loading={pageLoading} isError={error.isError} params={{ error, type: 'container' }}>
        <Helmet title="Chi tiết chính sách" />
        <Pane className="row" style={{ marginBottom: 20 }}>
          <Pane className="col">
            <Heading type="page-title">19/2021/QĐ-CT</Heading>
          </Pane>
        </Pane>

        <Pane className="card p20">
          <Heading type="form-title" className="mb10">
            Thông tin chung
          </Heading>

          <Pane className="row">
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Ngày lập:</label>
              <Pane className={styles.infoText}>
                24/03/2021
              </Pane>
            </Pane>
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Số quyết định:</label>
              <Pane className={styles.infoText}>
                19/2021/QĐ-CT
              </Pane>
            </Pane>
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Thời điểm hiệu lực:</label>
              <Pane className={styles.infoText}>
                01/06/2021 - 31/05/2022
              </Pane>
            </Pane>
            <Pane className="col-lg-3">
              <label className={styles.infoLabel}>Thời điểm nộp tiền:</label>
              <Pane className={styles.infoText}>
                01/06/2021 - 31/05/2022
              </Pane>
            </Pane>
          </Pane>
        </Pane>

        <Pane className="card">
          <Pane className={csx(commonStyles['block-table'], commonStyles['block-table-tab'])}>
            <Tabs onChange={changeTab} activeKey={tab}>
              {variablesModules.TABS.map((item) => (
                <TabPane tab={item.name} key={item.id} />
              ))}
            </Tabs>

            {tables[tab]}
          </Pane>
        </Pane>
      </Loading>
    </Pane>
  );
});

export default Index;

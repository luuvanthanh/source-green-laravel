import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, Form } from 'antd';
import { useSelector } from 'dva';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

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
  const formRef = useRef();
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

  const [{ menuLeftFeePolicy }] = useSelector(({ menu }) => [menu]);

  const pageLoading = loading[''];

  const [tab, setTab] = useState('schedule');

  const changeTab = (key) => {
    setTab(key);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const finishForm = () => {}

  return (
    <Form layout="vertical" colon={false} ref={formRef} onFinish={finishForm}>
      <Breadcrumbs className="pb0" last="Thêm mới" menu={menuLeftFeePolicy} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading loading={pageLoading} isError={error.isError} params={{ error, type: 'container' }}>
          <Helmet title="Thêm mới chính sách" />

          <Pane className="card p20">
            <Heading type="form-title" className="mb10">
              Thông tin chung
            </Heading>

            <Pane className="row">
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Ngày lập"
                  name="ngayLap"
                  rules={[variables.RULES.EMPTY]}
                  type={variables.INPUT}
                  data={[]}
                  // onChange={this.selectBranch}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Số quyết định"
                  name="soQuyetDinh"
                  rules={[variables.RULES.EMPTY]}
                  type={variables.INPUT}
                  data={[]}
                  // onChange={this.selectBranch}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Thời điểm hiệu lực"
                  name="thoiDiemHieuLuc"
                  rules={[variables.RULES.EMPTY]}
                  type={variables.RANGE_PICKER}
                  data={[]}
                  // onChange={this.selectBranch}
                  allowClear={false}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Thời điểm nộp tiền"
                  name="thoiDiemNopTien"
                  type={variables.RANGE_PICKER}
                  data={[]}
                  // onChange={this.selectBranch}
                  allowClear={false}
                />
              </div>
            </Pane>
          </Pane>

          <Pane className="card">
            <Pane className={csx(commonStyles['block-table'], commonStyles['block-table-tab-new'])}>
              <Heading type="form-title" className="heading-tab">
                Chi tiết
              </Heading>
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
    </Form>
  );
});

export default Index;

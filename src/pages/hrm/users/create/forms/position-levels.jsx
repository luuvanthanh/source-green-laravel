import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { variables, Helper } from '@/utils';

const Index = memo(() => {
  const {
    loading: { effects },
    positionLevels,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    positionLevels: HRMusersAdd.positionLevels,
  }));
  const loadingSubmit =
    effects[`HRMusersAdd/ADD_DIMISSEDS`] || effects[`HRMusersAdd/UPDATE_DIMISSEDS`];
  const loading = effects[`HRMusersAdd/GET_POSITION_LEVELS`];
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const mounted = useRef(false);
  const formRefModal = useRef();
  const mountedSet = (action, value) => {
    if (mounted.current) {
      action(value);
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'text',
        width: 100,
        className: 'min-width-100',
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        className: 'min-width-150',
        render: (record) => get(record, 'branch.name'),
      },
      {
        title: 'Bộ phận',
        key: 'division',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'division.name'),
      },
      {
        title: 'Chức danh',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'position.name'),
      },
    ];
    return columns;
  };

  /**
   * Load Items dismisseds
   */
  useEffect(() => {
    dispatch({
      type: 'HRMusersAdd/GET_POSITION_LEVELS',
      payload: params,
    });
  }, []);

  return (
    <>
      <Form layout="vertical" ref={formRef} onFinish>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="form-title">Cấp bậc, chức vụ</Heading>
          </Pane>
          <Pane style={{ padding: 20 }}>
            <Table
              bordered
              columns={header()}
              dataSource={positionLevels}
              pagination={false}
              loading={loading}
              className="table-edit"
              isEmpty
              params={{
                header: header(),
                type: 'table',
              }}
              bordered={false}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Form>
    </>
  );
});

export default Index;

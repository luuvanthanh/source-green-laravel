import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { get } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Helper, variables } from '@/utils';
import moment from 'moment';

const Index = memo(() => {
  const {
    loading: { effects },
    positionLevels,
  } = useSelector(({ loading, HRMusersAdd }) => ({
    loading,
    positionLevels: HRMusersAdd.positionLevels,
  }));
  const loading = effects[`HRMusersAdd/GET_POSITION_LEVELS`];
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const getBusByStatus = (record) => {
    if (record?.startDate || record?.endDate) {
      const now = moment().set({'hour': 0, 'minute': 0, 'second': 0});
      const numberStartDate = record?.startDate ? moment(record?.startDate, variables.DATE_FORMAT.DATE_AFTER).diff(now, 'days', true).toFixed(0) : '';
      const numberEndDate = record?.endDate ? moment(record?.endDate, variables.DATE_FORMAT.DATE_AFTER).diff(now, 'days', true).toFixed(0) : '';
      if (record?.endDate) {
        if (numberEndDate < 0) {
          return Helper.tagStatus(variables.STATUS.EXPIRE, 'Hết hiệu lực');
        }
        if (numberStartDate <= 0 && numberEndDate >= 0) {
          return Helper.tagStatus('', 'Đang hiệu lực');
        }
      }
      if (!record?.endDate && numberStartDate <= 0) {
        return Helper.tagStatus('', 'Đang hiệu lực');
      }
      if (numberStartDate > 0) {
        return Helper.tagStatus(variables.STATUS.PROCESSED, 'Chưa hiệu  lực');
      }
      return '';
    }
    return '';
  };

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
        title: 'Thời gian bắt đầu',
        key: 'startDate',
        className: 'min-width-150',
        render: (record) => Helper.getDate(record.startDate),
      },
      {
        title: 'Thời gian kết thúc',
        key: 'endDate',
        className: 'min-width-150',
        render: (record) => Helper.getDate(record.endDate),
      },
      {
        title: 'Bộ phận',
        key: 'division',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'division.name'),
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
        title: 'Chức vụ',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => get(record, 'position.name'),
      },
      {
        title: 'Trạng thái',
        key: 'position',
        className: 'min-width-150',
        width: 150,
        render: (record) => getBusByStatus(record)
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

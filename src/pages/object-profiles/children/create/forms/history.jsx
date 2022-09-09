import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Helper, variables } from '@/utils';

const Index = memo(() => {
  const {
    loading: { effects },
    historyData,
  } = useSelector(({ loading, OPchildrenAdd }) => ({
    loading,
    historyData: OPchildrenAdd.history,
  }));
  const loading = effects[`OPchildrenAdd/GET_HISTORY`];
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

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Năm học',
        key: 'year',
        width: 150,
        className: 'min-width-150',
        render: (record) => (<>{record?.schoolYear?.yearFrom} - {record?.schoolYear?.yearTo}</>),
      },
      {
        title: 'Lớp',
        key: 'class',
        width: 250,
        className: 'min-width-250',
        render: (record) => <>{record?.class?.name}</>,
      },
      {
        title: 'Cơ sở',
        key: 'branch',
        width: 250,
        className: 'min-width-250',
        render: (record) => <>{record?.class?.branch?.name}</>,
      },
      {
        title: 'Ngày vào Lớp',
        key: 'date',
        width: 80,
        className: 'min-width-80',
        render: (record) => Helper.getDate(record.joinDate, variables.DATE_FORMAT.DATE),
      },
    ];
    return columns;
  };


  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'OPchildrenAdd/GET_HISTORY',
        payload: {
          id: params.id,
        },
      });
    }
  }, [params?.id]);

  return (
    <>
      <div>
        <Form layout="vertical" ref={formRef} onFinish>
          <Pane className="card">
            <Pane style={{ padding: 20 }} className="pb-0">
              <Heading type="page-title">Lịch sử lớp học</Heading>
            </Pane>
            <Pane style={{ padding: 20 }}>
              <Table
                columns={header()}
                dataSource={historyData}
                pagination={false}
                loading={loading}
                className="table-normal"
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
      </div>
    </>
  );
});

export default Index;

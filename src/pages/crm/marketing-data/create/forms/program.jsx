import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import { get } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import { useLocation, useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { Helper } from '@/utils';
import Button from '@/components/CommonComponent/Button';

const Index = memo(() => {
  const {
    loading: { effects },
    programs,
  } = useSelector(({ loading, crmMarketingDataAdd }) => ({
    loading,
    programs: crmMarketingDataAdd.programs,
  }));
  const loading = effects[`crmMarketingDataAdd/GET_DATA_PROGRAM`];
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const mounted = useRef(false);
  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const onRemove = (id) => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'crmMarketingDataAdd/REMOVE_PROGRAM',
          payload: {
            marketing_program_id: id,
            data_marketing_id: params.id,
          },
          callback: () => {
            dispatch({
              type: 'crmMarketingDataAdd/GET_DATA_PROGRAM',
              payload: params,
            });
          },
        });
      },
    });
  };

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Tên chương trình',
        key: 'program',
        render: (record) => <Text size="normal">{get(record, 'name')}</Text>,
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 150,
        fixed: 'right',
        align: 'center',
        render: (record) => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <Button
                color="danger"
                icon="remove"
                className="ml-2"
                onClick={() => onRemove(record.id)}
              />
            </li>
          </ul>
        ),
      },
    ];
    return columns;
  };

  useEffect(() => {
    dispatch({
      type: 'crmMarketingDataAdd/GET_DATA_PROGRAM',
      payload: params,
    });
  }, []);

  return (
    <>
      <Form layout="vertical" ref={formRef} onFinish>
        <Pane className="card">
          <Pane style={{ padding: 20 }}>
            <Pane className="row" style={{ display: 'flex', padding: '0px 20px 20px 20px' }}>
              <Heading type="page-title">Danh sách chương trình</Heading>
              <Button
                className="ml-auto"
                color="success"
                icon="plus"
                onClick={() => history.push(`${pathname}/tao-moi`)}
              >
                Tạo mới
              </Button>
            </Pane>
            <Table
              columns={header()}
              dataSource={programs}
              pagination={false}
              loading={loading}
              isEmpty
              params={{
                header: header(),
                type: 'table',
              }}
              bordered={false}
              rowKey={(record) => record.index}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Form>
    </>
  );
});

export default Index;

import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import { useParams, history } from 'umi';
import csx from 'classnames';

import { useSelector, useDispatch } from 'dva';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';

import stylesModule from '../../styles.module.scss';

const Index = memo(() => {
  const {
    loading: { effects },
    details,
    dataAllergicIngredients,
  } = useSelector(({ loading, OPchildrenAdd }) => ({
    loading,
    details: OPchildrenAdd.details,
    dataAllergicIngredients: OPchildrenAdd.dataAllergicIngredients,
  }));
  const loading = effects[`OPchildrenAdd/GET_ALLERGIC_INGREDIENTS`];
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
        title: 'STT',
        key: 'a',
        className: 'min-width-80',
        width: 80,
        render: (text, record, index) => <Text size="normal">{index + 1}</Text>,
      },
      {
        title: 'Lớp',
        key: 'class',
        className: 'min-width-250',
        render: (record) => <Text size="normal">{record?.studentName}</Text>,
      },
    ];
    return columns;
  };

  const onLoad = () => {
    dispatch({
      type: 'OPchildrenAdd/GET_ALLERGIC_INGREDIENTS',
      payload: {
        studentId: params?.id,
        classId: details?.student?.classId,
      },
      callback: () => {},
    });
  };

  useEffect(() => {
    if (params?.id && details?.student?.classId) {
      onLoad();
    }
  }, [params?.id, details]);

  return (
    <>
      <div>
        <Form layout="vertical" ref={formRef} onFinish>
          <Pane className="card">
            <Pane style={{ padding: 20 }} className="pb-0">
              <Heading type="page-title">Nguyên liệu dị ứng</Heading>
            </Pane>
            <div className={csx(stylesModule['wrapper-table'], 'p20')}>
              <Table
                columns={header()}
                dataSource={dataAllergicIngredients}
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
            </div>
          </Pane>
          <Pane>
            <Button
              color="success"
              style={{ marginLeft: 'auto' }}
              size="large"
              onClick={() => {
                history.push(
                  `/ho-so-doi-tuong/hoc-sinh/${details?.student?.id}/chinh-sua?type=allergicIngredients`,
                );
              }}
              permission="WEB_HSDT_HOCSINH_EDIT"
            >
              Chỉnh sửa
            </Button>
          </Pane>
        </Form>
      </div>
    </>
  );
});

export default Index;

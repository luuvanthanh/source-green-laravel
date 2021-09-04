import { memo, useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';

import { Helper } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [{ error, data }, loading] = useSelector(({ loading: { effects }, groupByType }) => [
    groupByType,
    effects,
  ]);

  const history = useHistory();
  const { query, pathname } = useLocation();

  const mounted = useRef(false);

  const [search] = useState({
    keyWord: query?.keyWord,
    isParent: 'false',
    type: 'MEDICAL',
  });

  const columns = [
    {
      title: 'Tên thời kỳ nhạy cảm',
      key: 'name',
      className: 'min-width-200',
      render: (record) => <Text size="normal">{record.description} </Text>,
    },
    {
      key: 'action',
      className: 'min-width-80',
      width: 80,
      render: (record) => (
        <div className={styles['list-button']}>
          <button
            className={classnames(styles['button-circle'], styles.success)}
            type="button"
            onClick={() => history.push(`${pathname}/${record?.id}/chi-tiet`)}
          >
            <span className="icon-edit" />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'groupByType/GET_DATA',
      payload: { ...search },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
      }),
    });
  }, [search]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  return (
    <>
      <Helmet title="Nhóm buổi" />
      <Pane className="p20">
        <Pane className="col-lg-6 offset-lg-3">
          <Pane className="d-flex mb20">
            <Heading type="page-title">Nhóm buổi</Heading>
            <Button
              className="ml-auto"
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/them-moi`)}
            >
              Tạo mới
            </Button>
          </Pane>

          <Pane className="card">
            <Table
              columns={columns}
              showHeader={false}
              dataSource={data}
              loading={loading['groupByType/GET_DATA']}
              isError={error.isError}
              pagination={false}
              rowKey={(record) => record.id}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;

import { memo, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet';
import FormItem from '@/components/CommonComponent/FormItem';
import Button from '@/components/CommonComponent/Button';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';

import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils/variables';
import stylesModule from './styles.module.scss';



const Index = memo(() => {

  const [data, setData] = useState([
    {
      config_profile_info_id: undefined,
      status: true,
      file_image: undefined,
      id: uuidv4(),
    },
  ]);
  const [remove, setRemove] = useState([]);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Khoảng điểm từ',
        key: 'a',
        className: 'min-width-120',
        render: () =>
          <FormItem
            className={stylesModule.item}
            name="a"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY_INPUT]}
          />,
      },
      {
        title: 'Khoảng điểm đến',
        key: 'a',
        className: 'min-width-120',
        render: () =>
          <FormItem
            className={stylesModule.item}
            name="a"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY_INPUT]}
          />,
      },
      {
        title: 'Xếp loại',
        key: 'a',
        className: 'min-width-250',
        render: () =>
          <FormItem
            className={stylesModule.item}
            name="a"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY_INPUT]}
          />,
      },
      {
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
            />
            <Button
              onClick={() => {
                setData(
                  data.filter(
                    (val) =>
                      (val.key || val.id || val.test) !== (record.key || record.id || record.test),
                  ),
                );
                setRemove([...remove, record.id]);
              }}
              type="button"
              color="danger"
              icon="remove"
              className={stylesModule.remove}
            />
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <>
      <Helmet title="Điểm đánh giá" />
      <div className="col-lg-6 offset-lg-3">
        <Heading type="form-title" className="mb15 mt20">
          Điểm đánh giá
        </Heading>
        <div className={stylesModule['wrapper-table']}>
          <Table
            columns={header()}
            dataSource={data}
            pagination={false}
            className="table-edit"
            isEmpty
            params={{
              header: header(),
              type: 'table',
            }}
            bordered={false}
            rowKey={(record) => record.id}
            scroll={{ x: '100%' }}
            footer={(item, index) => (

              <Button
                key={index}
                onClick={() =>
                  setData([
                    ...data,
                    {
                      id: uuidv4(),
                      status: true,
                      file_image: undefined,
                    },
                  ])
                }
                color="transparent-success"
                icon="plus"
              >
                Thêm dòng
              </Button>

            )}
          />
        </div>
      </div>
    </>
  );
});

export default Index;
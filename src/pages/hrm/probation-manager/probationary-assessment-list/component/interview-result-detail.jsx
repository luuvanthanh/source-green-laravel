import { memo, useEffect, useRef } from 'react';
import Table from '@/components/CommonComponent/Table';
import Pane from '@/components/CommonComponent/Pane';

import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils';

import styles from '@/assets/styles/Common/common.scss';


const Index = memo(() => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Tiêu chí đánh giá',
        key: 'a',
        className: 'min-width-200',
        render: (record) => record?.name,
      },
      {
        title: 'Điểm đánh giá',
        key: 'a',
        className: 'min-width-150',
        render: (record) => record?.name,
      },
      {
        title: 'Nhận xét',
        key: 'a',
        className: 'min-width-400',
        render: (record) => record?.name,
      },
    ];
    return columns;
  };

  return (
    <>
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail name="LV0001" label="ID" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name="LV0001" label="ID" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
      <Pane className="row pt20">
        <Pane className="col-lg-12">
          <FormDetail label="Chi tiết" type={variables.TYPE.LABEL} />
        </Pane>
        <Pane className="col-lg-12">
          <Pane className={styles['table-header-blue']}>
            <Table
              columns={header()}
              dataSource={[{ name: 'Trình độ chuyên môn' }]}
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
            />
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
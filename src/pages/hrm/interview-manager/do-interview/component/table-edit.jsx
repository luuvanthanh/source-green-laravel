import { memo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import styles from '@/assets/styles/Common/common.scss';
import Heading from '@/components/CommonComponent/Heading';

import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils/variables';


const Index = memo(() => {

  const data = [{
    config_profile_info_id: undefined,
    status: true,
    file_image: undefined,
    id: uuidv4(),
  }];

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Tiêu chí đánh giá',
        key: 'number',
        className: 'min-width-150',
        render: (record) => record?.name,
      },
      {
        title: 'Điểm đánh giá',
        key: 'a',
        className: 'min-width-120',
        render: () =>
          <FormItem
            className={styles.item}
            name="a"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY_INPUT]}
          />,
      },
      {
        title: 'Nhận xét',
        key: 'a',
        className: 'min-width-400',
        render: () =>
          <FormItem
            className={styles.item}
            name="a"
            type={variables.INPUT}
            rules={[variables.RULES.EMPTY_INPUT]}
          />,
      },
    ];
    return columns;
  };

  return (
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Thông tin chung
      </Heading>
      <div className={styles['table-header-blue']}>
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
        />
      </div>
    </Pane>
  );
});

export default Index;
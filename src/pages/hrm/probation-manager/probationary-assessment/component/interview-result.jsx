import { memo, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';
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
        key: 'number',
        className: 'min-width-150',
        render: (record) => record?.name,
      },
      {
        title: 'Nhận xét',
        key: 'number',
        className: 'min-width-400',
        render: (record) => record?.name,
      },
    ];
    return columns;
  };

  return (
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Kết quả phỏng vấn
      </Heading>
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail name="6.7" label="Điểm trung bình" type={variables.TYPE.TEXT} />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail name=" " label="Kết quả" type={variables.TYPE.TEXT} />
        </Pane>
      </Pane>
      <Pane className="row  pt20">
        <Pane className="col-lg-12">
          <FormDetail label="Chi tiết" type={variables.TYPE.LABEL} />
        </Pane>
        <Pane className="col-lg-12">
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
      </Pane>
    </Pane>
  );
});

export default Index;
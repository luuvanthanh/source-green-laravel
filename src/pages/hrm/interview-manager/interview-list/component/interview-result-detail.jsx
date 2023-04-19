import { memo, useEffect, useRef } from 'react';
import Table from '@/components/CommonComponent/Table';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils';
import PropTypes from 'prop-types';

import styles from '@/assets/styles/Common/common.scss';

const Index = memo(({ details }) => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Tiêu chí đánh giá',
        key: 'name',
        className: 'min-width-200',
        render: (record) => record?.name,
      },
      {
        title: 'Điểm đánh giá',
        key: 'average',
        className: 'min-width-150',
        render: (record) => record?.average,
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
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Kết quả phỏng vấn
      </Heading>
      <Pane className="row border-bottom">
        <Pane className="col-lg-3">
          <FormDetail
            name={details?.mediumScore}
            label="Điểm trung bình"
            type={variables.TYPE.TEXT}
          />
        </Pane>
        <Pane className="col-lg-3">
          <FormDetail label="Kết quả" type={variables.TYPE.TEXT} />
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
              dataSource={details?.evaluationCriteria}
              className="table-edit"
              isEmpty
              pagination={false}
              params={{
                header: header(),
                type: 'table',
              }}
              bordered={false}
              rowKey={(record) => record?.evaluationCriteriaId}
              scroll={{ x: '100%' }}
            />
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

Index.propTypes = {
  details: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  details: {},
};

export default Index;

import { memo } from 'react';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';
import styles from '@/assets/styles/Common/common.scss';
import Heading from '@/components/CommonComponent/Heading';
import PropTypes from 'prop-types';
import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils/variables';

const Index = memo(({ details }) => {
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
        key: 'pointEvaluation',
        className: 'min-width-150',
        render: (record) => record?.pointEvaluation,
      },
      {
        title: 'Nhận xét',
        key: 'comment',
        className: 'min-width-400',
        render: (record) => record?.comment,
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
          <FormDetail name={details?.description} label="Kết quả" type={variables.TYPE.TEXT} />
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
              dataSource={details?.evaluationCriteria}
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

Index.propTypes = {
  details: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  details: {},
};

export default Index;

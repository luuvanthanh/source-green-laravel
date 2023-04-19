import { memo, useEffect, useRef } from 'react';
import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import { debounce } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';
import csx from 'classnames';

import Heading from '@/components/CommonComponent/Heading';
import PropTypes from 'prop-types';

import Table from '@/components/CommonComponent/Table';
import { variables } from '@/utils/variables';
import stylesModule from '../styles.module.scss';

const Index = memo(({ dataEvaluationCriteria, setDataEvaluationCriteria }) => {
  const debouncedSearch = debounce((e, record, key) => {
    setDataEvaluationCriteria((prev) =>
      prev.map((item) =>
        item.id === record.id ? { ...item, [key]: e.target.value } : { ...item },
      ),
    );
  }, 300);

  const onChange = (e, record, key) => {
    if (key === 'pointEvaluation') {
      setDataEvaluationCriteria((prev) =>
        prev.map((item) => (item.id === record.id ? { ...item, [key]: e } : { ...item })),
      );
    } else {
      debouncedSearch(e, record, key);
    }
  };

  const dataPoint = (n) => {
    const allTime = [];
    for (let i = 1; i <= n; i += 1) {
      allTime.push({ name: `${i}` });
    }

    return allTime.map((i, id) => ({ id: id + 1, ...i }));
  };

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
        className: 'min-width-150',
        render: (record) => record?.name,
      },
      {
        title: 'Điểm đánh giá',
        key: 'pointEvaluation',
        className: 'labelRequired',
        render: (record) => (
          <FormItem
            name={[record?.id, 'pointEvaluation']}
            data={dataPoint(10)}
            type={variables.SELECT}
            onChange={(e) => onChange(e, record, 'pointEvaluation')}
            rules={[variables.RULES.EMPTY]}
          />
        ),
      },
      {
        title: 'Nhận xét',
        key: 'comment',
        className: `${csx('min-width-400', 'labelRequired')}`,
        render: (record) => (
          <FormItem
            name={[record?.id, 'comment']}
            type={variables.INPUT}
            onChange={(e) => onChange(e, record, 'comment')}
            rules={[variables.RULES.EMPTY]}
          />
        ),
      },
    ];
    return columns;
  };

  return (
    <Pane className="card p20">
      <Heading type="form-title" className="mb15">
        Chi tiết phỏng vấn
      </Heading>
      <div className={csx(styles['table-header-blue'], stylesModule['wrapper-table'])}>
        <Table
          columns={header()}
          dataSource={dataEvaluationCriteria}
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

Index.propTypes = {
  dataEvaluationCriteria: PropTypes.PropTypes.any,
  setDataEvaluationCriteria: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  dataEvaluationCriteria: [],
  setDataEvaluationCriteria: () => {},
};

export default Index;

import React from 'react';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import styles from '../style.module.scss';

function Result() {
  return (
    <div className="row">
      <div className="col-lg-12 mb20">
        <p className={styles['call-result-info']}>Không xác định - 0905123321</p>
      </div>
      <div className="col-lg-12">
        <FormItem
          label="Phân loại phụ huynh"
          name="type"
          type={variables.SELECT}
          allowClear={false}
          disabled
        />
      </div>
      <div className="col-lg-12">
        <FormItem
          label="Tình trạng Lead"
          name="status"
          type={variables.SELECT}
          allowClear={false}
          disabled
        />
      </div>
      <div className="col-lg-12">
        <FormItem
          label="Tình trạng Tiềm năng (Chặng sale)"
          name="potential"
          type={variables.SELECT}
          allowClear={false}
          disabled
        />
      </div>
      <div className="col-lg-12">
        <FormItem
          label="Kết quả cuộc gọi"
          placeholder="Kết quả cuộc gọi"
          name="note"
          type={variables.TEXTAREA}
          rules={[variables.RULES.MAX_LENGTH_INPUT]}
          showCount={false}
        />
      </div>
    </div>
  );
}

export default Result;

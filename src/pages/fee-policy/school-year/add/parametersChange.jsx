import { memo, useState } from 'react';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Table from '@/components/CommonComponent/Table';

import { variables } from '@/utils';

const Index = memo(() => {
  const [paramChanges] = useState([{ id: 1 }]);


  const onFinish = () => {
  };


  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Hình thức',
        key: 'form',
        className: 'min-width-200',
        render: () => 'THANG'
      },
      {
        title: 'Ngày học theo lịch',
        key: 'date',
        className: 'min-width-200',
        render: () => '08/2021',
      },
      {
        title: 'Ngày đến hạn thanh toán',
        key: 'expired',
        className: 'min-width-300',
        render: () => '08/2021',
      },
    ];
    return columns;
  };

  return (
    <Pane className="p20">
      <div className="row">
        <div className="col-lg-3">
          <label htmlFor="" className="mb5">Thời điểm</label>
          <p className="mb0 py10 font-weight-bold">08/01/2021 - 31/05/2022</p>
        </div>
        <div className="col-lg-3">
          <FormItem
            data={[]}
            label="Hình thức"
            name='form'
            // rules={[variables.RULES.EMPTY]}
            type={variables.SELECT}
            // onChange={(event) => this.onChangeParamaterValues(event, index)}
          />
        </div>
        <div className="col-lg-3">
          <FormItem
              label="TÊN"
              name="name"
              // rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
              type={variables.INPUT}
            />
        </div>
        <div className="col-lg-3">
          <Button
            className="px25 btn-small"
            color="success"
            size="large"
            onClick={onFinish}
          >
            Áp dụng
          </Button>
        </div>
      </div>
      <Table
        name="table"
        bordered
        columns={header()}
        dataSource={paramChanges}
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </Pane>
  );
});

export default Index;

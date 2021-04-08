import { memo, useRef } from 'react';
import { Form } from 'antd';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';

const Level = memo(() => {
  const formRef = useRef();

  return (
    <Form layout="vertical" ref={formRef} onFinish initialValues={{}}>
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Thời gian làm việc</Heading>
        </Pane>

        <Pane className={csx('pb-0', 'border-bottom', 'position-relative')} style={{ padding: 20 }}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem name="date" label="Ngày vào làm" type={variables.DATE_PICKER} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem
                name={'dateRegister'}
                label="Ngày ký hợp đồng lao động"
                type={variables.DATE_PICKER}
              />
            </Pane>
          </Pane>
        </Pane>

        <Pane style={{ padding: 20 }}>
          <Button color="success" size="large" style={{ marginLeft: 'auto' }} htmlType="submit">
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
});

export default Level;

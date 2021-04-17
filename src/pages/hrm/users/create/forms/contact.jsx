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
          <Heading type="form-title">Thông tin liên hệ</Heading>
        </Pane>

        <Pane className={csx('pb-0', 'border-bottom', 'position-relative')} style={{ padding: 20 }}>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem name="address" label="Địa chỉ hiện tại" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-6">
              <FormItem name={'zalo'} label="Zalo" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-6">
              <FormItem name={'facebook'} label="Facebook" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name={'contact'} label="Người liên hệ" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name={'contactUser'} label="Quan hệ với nhân viên" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name={'phone'} label="Số điện thoại khẩn cấp" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name={'born'} label="Quê quán" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name={'stress'} label="Phường (xã, thị trấn)" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name={'provice'} label="Quận/Huyện" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name={'city'} label="Tỉnh/Thành phố" type={variables.INPUT} />
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

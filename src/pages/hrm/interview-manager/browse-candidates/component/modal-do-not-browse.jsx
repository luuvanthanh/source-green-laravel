import { memo, useEffect, useRef } from 'react';
import { Form, Modal } from 'antd';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import PropTypes from 'prop-types';

import styles from '@/assets/styles/Common/common.scss';

import { variables } from '@/utils';

const Index = memo(({ setCheckModal, checkModal }) => {
  const mounted = useRef(false);
  const [form] = Form.useForm();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const handleCancel = () => {
    setCheckModal(false);
  };

  const handleOk = () => {
    setCheckModal(false);
  };

  return (
    <Modal
      centered
      title="Xác nhận không duyệt"
      visible={checkModal}
      className={styles['wrapper-modal']}
      onCancel={handleCancel}
      footer={[
        <>
          <p
            key="back"
            role="presentation"
            onClick={() => handleCancel()}
            className={styles['wrapper-modal-cancel']}
          >
            Hủy
          </p>
          <Button
            htmlType="submit"
            color="success"
            type="primary"
            onClick={() => handleOk()}
          >
            Không duyệt
          </Button>
        </>
      ]}
    >
      <Form layout="vertical" form={form}>
        <div className="row">
          <div className="col-lg-12">
            <FormItem
              data={[
                { value: false, label: 'Không duyệt lương' },
                { value: true, label: 'Không duyệt ứng viên' },
              ]}
              name="married"
              className={styles['wrapper-radio']}
              label="Nguyên do"
              type={variables.RADIO}
              rules={[variables.RULES.EMPTY_INPUT]}
            />
          </div>
          <div className="col-lg-12">
            <FormItem
              name="code"
              placeholder="Nhập"
              type={variables.TEXTAREA}
              rules={[variables.RULES.EMPTY_INPUT]}
              label="Nội dung"
              disabled
            />
          </div>
        </div>
      </Form>
    </Modal>
  );
});

Index.propTypes = {
  checkModal: PropTypes.objectOf(PropTypes.any),
  setCheckModal: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  checkModal: false,
  setCheckModal: false,
};

export default Index;
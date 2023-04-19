import { memo, useEffect, useRef } from 'react';
import { Form, Modal } from 'antd';
import Button from '@/components/CommonComponent/Button';
import { useParams, history } from 'umi';
import { useDispatch } from 'dva';
import { size, get } from 'lodash';

import FormItem from '@/components/CommonComponent/FormItem';
import PropTypes from 'prop-types';

import styles from '@/assets/styles/Common/common.scss';

import { variables } from '@/utils';
import VariablesModules from '../../utils/variables';

const Index = memo(({ setCheckModal, checkModal }) => {
  const mounted = useRef(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const params = useParams();

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const handleCancel = () => {
    setCheckModal(false);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'hrmRecruitmentBrowseCandidates/BROWSING_CANDIDATE',
        payload: {
          id: params?.id,
          status: VariablesModules.STATUS.PENDING,
          flag: values?.flag,
          messages: values?.messages,
        },
        callback: (response, error) => {
          if (response) {
            history.goBack();
            setCheckModal(false);
          }
          if (error) {
            const { data } = error;
            if (data?.status === 400 && !!size(data?.errors)) {
              data?.errors.forEach((item) => {
                form?.setFields([
                  {
                    name: get(item, 'source.pointer'),
                    errors: [get(item, 'detail')],
                  },
                ]);
              });
            }
          }
        },
      });
    });
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
          <Button htmlType="submit" color="success" type="primary" onClick={() => handleOk()}>
            Không duyệt
          </Button>
        </>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <div className="row">
          <div className="col-lg-12">
            <FormItem
              data={[
                { value: 'NO_SALARY_APPROVAL', label: 'Không duyệt lương' },
                { value: 'DO_NOT_APPROVECANDIDATES', label: 'Không duyệt ứng viên' },
              ]}
              name="flag"
              className={styles['wrapper-radio']}
              label="Nguyên do"
              type={variables.RADIO}
              rules={[variables.RULES.EMPTY]}
            />
          </div>
          <div className="col-lg-12">
            <FormItem
              name="messages"
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

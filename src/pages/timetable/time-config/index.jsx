import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';

const Index = memo(() => {
  const [formRef] = Form.useForm();

  const onFinish = () => {};

  return (
    <>
      <Helmet title="Cấu hình thời gian" />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <Text color="dark">Cấu hình thời gian</Text>
        </div>
        <Form
          className={styles['layout-form']}
          layout="vertical"
          form={formRef}
          onFinish={onFinish}
        >
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className={styles['content-form']}>
                <Loading>
                  <div className={classnames(styles['content-children'], 'mt0')}>
                    <Text color="dark" size="large-medium">
                      Thông tin thêm mới
                    </Text>
                    <div className="row mt-4">
                      <div className="col-lg-4">
                        <FormItem
                          label="Thời gian học từ"
                          name="timeStart"
                          type={variables.TIME_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          label="Thời gian học đến"
                          name="timeEnd"
                          type={variables.TIME_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-4">
                        <FormItem
                          label="Số phút một tiết học"
                          name="minutesSubject"
                          type={variables.INPUT_COUNT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </div>
                  </div>
                </Loading>
                <div className="row">
                  <div className="col-lg-12 mt-4 d-flex justify-content-end">
                    <Button color="green" icon="save" htmlType="submit" size="large">
                      LƯU
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
});

export default Index;

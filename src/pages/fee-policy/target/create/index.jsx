import { memo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory } from 'umi';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables } from '@/utils';
import styles from '@/assets/styles/Common/information.module.scss';

const Index = memo(({ }) => {
  const { loading } = useSelector(({ loading }) => ({ loading }));
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (action, value) => mounted?.current && action(value);

  const onFinish = (values) => {
    history.goBack()
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo mới nhóm đối tượng" />
      <Pane className="row" style={{ marginBottom: 20 }}>
        <Pane className="col">
          <Heading type="page-title">Tạo mới nhóm đối tượng</Heading>
        </Pane>
      </Pane>
      <Pane className="row justify-content-center">
        <Pane className="col-lg-6">
          <Pane className="card">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{}}
            >
              <Pane className="px20 pt20">
                <Heading type="form-title" className="mb20">
                  Thông tin nhóm đối tượng
                </Heading>

                <Pane className={csx('row', 'border-bottom')}>
                  <Pane className="col-lg-6">
                    <FormItem
                      label="Mã nhóm"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-6">
                    <FormItem
                      label="Tên nhóm"
                      type={variables.INPUT}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      label="Mô tả"
                      name="description"
                      type={variables.INPUT}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <FormItem
                      label="Tri ân"
                      type={variables.CHECKBOX_SINGLE}
                    />
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="p20">
                <Button
                  className="ml-auto px25"
                  color="success"
                  htmlType="submit"
                  size="large"
                >
                  Lưu
                </Button>
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;

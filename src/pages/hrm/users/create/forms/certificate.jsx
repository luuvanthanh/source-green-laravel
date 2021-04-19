import { memo, useRef } from 'react';
import { Form } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils/variables';
import { Scrollbars } from 'react-custom-scrollbars';

const Index = memo(() => {
  const formRef = useRef();

  return (
    <Form
      layout="vertical"
      ref={formRef}
      onFinish
      initialValues={{
        shuttlers: [{}],
      }}
    >
      <Pane className="card">
        <Pane style={{ padding: 20 }} className="pb-0">
          <Heading type="form-title">Chứng chỉ chuyên ngành</Heading>
        </Pane>

        <Form.List name="shuttlers">
          {(fields, { add, remove }) => (
            <>
              <Scrollbars autoHeight autoHeightMax={window.innerHeight - 400}>
                {fields.map(({ key, name }, index) => (
                  <Pane
                    key={key}
                    className={csx('pb-0', 'border-bottom', 'position-relative')}
                    style={{ padding: 20 }}
                  >
                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <FormItem
                          name={[key, 'level']}
                          label="Tên chứng chỉ"
                          type={variables.INPUT}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name={[key, 'relationship']}
                          label="Loại chứng chỉ"
                          type={variables.INPUT}
                        />
                      </Pane>
                    </Pane>
                    <Pane className="row">
                      <Pane className="col-lg-6">
                        <FormItem
                          name={[key, 'identityCard']}
                          label="Nơi đào tạo"
                          type={variables.INPUT}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          name={[key, 'date']}
                          label="Ngày cấp"
                          type={variables.DATE_PICKER}
                        />
                      </Pane>
                    </Pane>
                    {fields.length > 1 && (
                      <DeleteOutlined
                        className="position-absolute"
                        style={{ top: 20, right: 20 }}
                        onClick={() => remove(name)}
                      />
                    )}
                  </Pane>
                ))}
              </Scrollbars>

              <Pane style={{ padding: 20 }} className="border-bottom">
                <Button
                  color="success"
                  ghost
                  icon="plus"
                  onClick={() => {
                    add();
                  }}
                >
                  Thêm
                </Button>
              </Pane>
            </>
          )}
        </Form.List>

        <Pane style={{ padding: 20 }}>
          <Button color="success" size="large" style={{ marginLeft: 'auto' }} htmlType="submit">
            Lưu
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
});

export default Index;

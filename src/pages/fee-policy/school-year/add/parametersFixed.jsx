import { memo } from 'react';
import { Form } from 'antd';
import classnames  from 'classnames';
import { DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useParams } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import styles from '@/assets/styles/Common/common.scss';

import { variables } from '@/utils';

const Index = memo(({ fees }) => {
  const params = useParams();
  return (
    <Pane className="p20">
      <Form.List name="fixedParameter">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <div
                className={classnames(
                  'row',
                  styles['form-item'],
                  styles['form-item-advance'],
                )}
                key={field.key}
              >
                <div className="col-lg-4">
                  <FormItem
                    data={fees}
                    label="Hình thức"
                    name={[field.name, 'paymentFormId']}
                    fieldKey={[field.fieldKey, 'paymentFormId']}
                    rules={[variables.RULES.EMPTY]}
                    type={variables.SELECT}
                    // onChange={(event) => this.onChangeParamaterValues(event, index)}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Ngày đến hạn thanh toán"
                    name={[field.name, 'duaDate']}
                    rules={[variables.RULES.EMPTY]}
                    type={variables.DATE_PICKER}
                  />
                </div>
                {!params?.id && (
                  <div className="col-1">
                    {fields?.length > 1 ? (
                      <DeleteOutlined
                        className={styles['btn-delete']}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
            <div className="row mb-3">
              <div className="col-lg-3">
                <Button
                  color="success"
                  icon="plus"
                  ghost
                  onClick={() => {
                    add();
                  }}
                >
                  Thêm hình thức
                </Button>
              </div>
            </div>
          </>
        )}
      </Form.List>
    </Pane>
  );
});

Index.propTypes = {
  fees: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  fees: []
};

export default Index;

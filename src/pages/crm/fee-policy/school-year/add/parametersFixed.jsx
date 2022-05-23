import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import { variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { memo } from 'react';



const Index = memo(({ fees, formRef, checkValidate }) => {

  const handleChange = () => {
    formRef.current.validateFields().then(() => {
      checkValidate();
    });
  };

  return (
    <Pane className="p20">
      <Form.List
        name="fixedParameter"
      >
        {(fields) => (
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
                    onChange={handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <FormItem
                    label="Ngày đến hạn thanh toán"
                    name={[field.name, 'duaDate']}
                    rules={[variables.RULES.EMPTY]}
                    type={variables.DATE_PICKER}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </Form.List>
    </Pane>
  );
});

Index.propTypes = {
  fees: PropTypes.arrayOf(PropTypes.any),
  formRef: PropTypes.objectOf(PropTypes.any),
  checkValidate: PropTypes.func
};

Index.defaultProps = {
  fees: [],
  formRef: {},
  checkValidate: () => { }
};

export default Index;

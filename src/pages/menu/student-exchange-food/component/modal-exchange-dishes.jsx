import { memo, useEffect, useRef } from 'react';
import { Form, Modal } from 'antd';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { Helper, variables } from '@/utils';
import { head, isEmpty } from 'lodash';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(({ setCheckModal, checkModal, dataModal }) => {
  const mounted = useRef(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [dataFood] = useSelector(({ loading, menuStudentExchangeFood = {} }) => [
    menuStudentExchangeFood?.dataFood,
    loading,
  ]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    dispatch({
      type: 'menuStudentExchangeFood/GET_FOOD',
      payload: { page: variables.PAGINATION.PAGE, limit: variables.PAGINATION.SIZEMAX },
    });
  }, []);

  const handleCancel = () => {
    setCheckModal(false);
  };

  const handleOk = (values) => {
    dispatch({
      type: 'menuStudentExchangeFood/ADD',
      payload: {
        menuMealDetailId: dataModal?.menuMealDetailId,
        foodId: dataModal?.foodId,
        newFoodId: values?.newFoodId,
        date: dataModal?.date,
        studentId: dataModal?.studentId,
        // content: dataModal?.content,
        // imageURL: dataModal?.imageURL,
        requestStatus: 'CONFIRMED',
        materialId: dataModal?.materialId,
        classId: dataModal?.classId,
        studentMaterialId: dataModal?.studentMaterialId,
      },
      callback: (res, error) => {
        if (res) {
          setCheckModal(false);
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              form.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  return (
    <Modal
      centered
      title="Đổi món"
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
          <Button htmlType="submit" color="success" type="primary" onClick={() => form.submit()}>
            Lưu
          </Button>
        </>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={() => handleOk()}>
        <Pane className="row">
          <Pane className="col-lg-6">
            <FormDetail name={dataModal?.studentName} label="Học sinh" type={variables.TYPE.TEXT} />
          </Pane>
          <Pane className="col-lg-6">
            <FormDetail name={dataModal?.branchName} label="Cơ sở" type={variables.TYPE.TEXT} />
          </Pane>
          <Pane className="col-lg-6">
            <FormDetail name={dataModal?.className} label="Lớp" type={variables.TYPE.TEXT} />
          </Pane>
          <Pane className="col-lg-6">
            <FormDetail
              name={Helper.getDate(dataModal.date, variables.DATE_FORMAT.DATE)}
              label="Ngày thực đơn"
              type={variables.TYPE.TEXT}
            />
          </Pane>
          <Pane className="col-lg-6">
            <FormDetail
              name={dataModal?.foodName}
              label="Món theo thực đơn"
              type={variables.TYPE.TEXT}
            />
          </Pane>
          <Pane className="col-lg-6">
            <FormDetail
              name={dataModal?.materialName}
              label="Nguyên liệu dị ứng"
              type={variables.TYPE.TEXT}
            />
          </Pane>
        </Pane>
        <Pane className="row">
          <Pane className="col-lg-12">
            <FormItem
              name="newFoodId"
              placeholder="Nhập"
              data={dataFood}
              type={variables.SELECT}
              rules={[variables.RULES.EMPTY]}
              label="Đổi sang món"
            />
          </Pane>
        </Pane>
      </Form>
    </Modal>
  );
});

Index.propTypes = {
  checkModal: PropTypes.any,
  setCheckModal: PropTypes.any,
  dataModal: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  checkModal: false,
  setCheckModal: false,
  dataModal: {},
};

export default Index;

import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Pane from '@/components/CommonComponent/Pane';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import { variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import styles from '../style.module.scss';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const AddLead = memo(({ handleOnClick }) => {
  const [{ cities, district, townWards }] = useSelector(({ crmCallCenter }) => [crmCallCenter]);
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const [files, setFiles] = useState(null);

  const handleAddLead = () => {
    if (handleOnClick) {
      handleOnClick();
    }
  };

  const uploadFiles = (file) => {
    setFiles(file?.fileInfo?.url);
  };

  const onChangeCity = (city_id) => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DISTRICTS',
      payload: {
        city_id,
      },
    });
  };

  const onFinish = () => {
    formRef.getFieldValue();
  };

  return (
    <Form form={formRef} onFinish={onFinish} initialValues={{ search_source_id: 'Call Center' }}>
      <div className={classnames(styles['add-lead-form'], 'row')}>
        <div className={classnames(styles['header-form'], 'col-12')}>
          <p className={styles['header-title']}>Thêm phụ huynh Lead</p>
        </div>

        <div className={classnames(styles['content-form'], 'col-12')}>
          <p className={styles['content-title']}>Thông tin phụ huynh</p>
          <Pane className="row">
            <Pane className="col">
              <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                <MultipleImageUpload
                  files={files}
                  callback={(files) => uploadFiles(files)}
                  removeFiles={(files) => setFiles(files)}
                />
              </Form.Item>
            </Pane>
          </Pane>
          <Pane className="row border-bottom">
            <Pane className="col-lg-4">
              <FormItem
                name="full_name"
                label="Họ và tên"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="birth_date"
                label="Ngày sinh"
                type={variables.DATE_PICKER}
                disabledDate={(current) => current > moment()}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                options={['id', 'name']}
                name="sex"
                data={genders}
                placeholder="Chọn"
                type={variables.SELECT}
                label="Giới tính"
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="email"
                label="Email"
                type={variables.INPUT}
                rules={[variables.RULES.EMAIL]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="phone"
                label="Số điện thoại"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="other_phone"
                label="Số điện thoại Khác"
                type={variables.INPUT}
                rules={[variables.RULES.PHONE]}
              />
            </Pane>
            <Pane className="col-lg-12">
              <FormItem name="address" label="Địa chỉ" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                options={['id', 'name']}
                name="city_id"
                data={cities}
                placeholder="Chọn"
                type={variables.SELECT}
                label="Thuộc tỉnh thành"
                onChange={onChangeCity}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                options={['id', 'name']}
                name="district_id"
                data={district}
                placeholder="Chọn"
                type={variables.SELECT}
                label="Thuộc quận huyện"
                // onChange={onChangeDistricts}
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                options={['id', 'name']}
                data={townWards}
                name="town_ward_id"
                placeholder="Chọn"
                type={variables.SELECT}
                label="Phường/Xã"
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="facebook" label="Facebook" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="zalo" label="Zalo" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="skype" label="Skype" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="instagram" label="Instagram" type={variables.INPUT} />
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-4">
              <FormItem name="name_company" label="Tên công ty" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="address_company" label="Địa chỉ công ty" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="phone_company" label="Số điện thoại" type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem name="career" label="Nghề nghiệp " type={variables.INPUT} />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                options={['id', 'name']}
                name="branch_id"
                // data={branches}
                placeholder="Chọn"
                type={variables.SELECT}
                label="Cơ sở quan tâm"
              />
            </Pane>
            <Pane className="col-lg-4">
              <FormItem
                name="search_source_id"
                label="Nguồn tìm kiếm"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
                disabled
              />
            </Pane>
          </Pane>
        </div>

        <div
          className={classnames(
            styles['footer-form'],
            'col-12',
            'd-flex',
            'justify-content-between',
            'align-items-center',
          )}
        >
          <p className={styles['footer-cancel']} role="presentation" onClick={handleAddLead}>
            Huỷ
          </p>
          <Button
            color="success"
            className={styles['footer-save']}
            onClick={() => {
              handleAddLead();
            }}
            htmlType="submit"
          >
            Lưu
          </Button>
        </div>
      </div>
    </Form>
  );
});

AddLead.propTypes = {
  handleOnClick: PropTypes.func,
};

AddLead.defaultProps = {
  handleOnClick: () => {},
};

export default AddLead;

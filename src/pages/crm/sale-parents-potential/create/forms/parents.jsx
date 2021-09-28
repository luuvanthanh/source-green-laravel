import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables, Helper } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];

const marginProps = { style: { marginBottom: 12 } };
const General = memo(() => {
  const { details, data } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
  }));
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const [files, setFiles] = Helper.isJSON(details?.fileImage)
    ? useState(JSON.parse(details?.fileImage))
    : useState([]);

  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DATA',
      payload: params,
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const uploadFiles = (file) => {
    mountedSet(setFiles, (prev) => [...prev, file]);
  };

  return (
    <Form layout="vertical">
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Thông tin phụ huynh
          </Heading>
          <div className="row">
            <div className="col">
              <div className="ant-col ant-form-item-label">
                <label className="ant-form-item-required">
                  <span>Hình ảnh phụ huynh</span>
                </label>
              </div>
              <MultipleImageUpload
                files={files}
                callback={(files) => uploadFiles(files)}
                removeFiles={(files) => mountedSet(setFiles, files)}
              />
            </div>
          </div>
          <div className="row" {...marginProps}>
            <div className="col-lg-4">
              <FormItem
                name="fullName"
                label="Họ và tên"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="dateOfBirth"
                label="Ngày sinh"
                type={variables.DATE_PICKER}
                rules={[variables.RULES.EMPTY]}
                disabledDate={(current) => current > moment()}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                data={genders}
                name="gender"
                label="Giới tính"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="email"
                label="Email"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="phoneNumber"
                label="Số điện thoại"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="phoneNumber"
                label="Số điện thoại Khác"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="address"
                label="Địa chỉ"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                data={data}
                name="city"
                label="Thành phố"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                data={data}
                name="district"
                label="Quận"
                type={variables.SELECT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="facebook"
                label="Facebook"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="zalo"
                label="Zalo"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="skype"
                label="Skype"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="instagram"
                label="Instagram"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
          </div>
          <div className="row" {...marginProps}>
            <div className="col-lg-4">
              <FormItem
                name="company"
                label="Tên công ty"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="addressCompany"
                label="Địa chỉ công ty"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY_INPUT]}
              />
            </div>
            <div className="col-lg-4">
              <FormItem
                name="phoneNumberCompany"
                label="Số điện thoại"
                type={variables.INPUT}
                rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end" style={{ padding: 20 }}>
          <Button color="success" size="large" htmlType="submit">
            Lưu
          </Button>
        </div>
      </div>
    </Form>
  );
});

export default General;

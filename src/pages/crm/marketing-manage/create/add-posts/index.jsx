import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { Helmet } from 'react-helmet';
import { useParams } from 'umi';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables, Helper } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const { details } = useSelector(({ loading, crmSaleLeadAdd }) => ({
    loading,
    details: crmSaleLeadAdd.details,
    data: crmSaleLeadAdd.data,
    error: crmSaleLeadAdd.error,
  }));

  const [files, setFiles] = Helper.isJSON(details?.fileImage)
    ? useState(JSON.parse(details?.fileImage))
    : useState([]);

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

  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const uploadFiles = (file) => {
    mountedSet(setFiles, (prev) => [...prev, file]);
  };

  return (
    <>
      <Helmet title="Thông tin thêm mới" />
      <Pane className="col-lg-6 offset-lg-3">
        <Form layout="vertical p20">
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                <Heading type="form-title">Thông tin thêm mới</Heading>
              </div>
              <div className="row">
                <Pane className="col-lg-12">
                  <FormItem name="posts" label="Tên bài viết" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-12">
                  <FormItem
                    name="contents"
                    label="Nội dung cuộc gọi"
                    rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                    type={variables.TEXTAREA}
                  />
                </Pane>
                <div className="row">
                  <div className="col">
                    <div className="ant-col ant-form-item-label pl20">
                      <label className="ant-form-item-required">
                        <span>Ảnh đại diện</span>
                      </label>
                    </div>
                    <MultipleImageUpload
                      files={files}
                      callback={(files) => uploadFiles(files)}
                      removeFiles={(files) => mountedSet(setFiles, files)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Pane className="p20 d-flex justify-content-between align-items-center ">
              <p className="btn-delete" role="presentation">
                Hủy
              </p>
              <Button className="ml-auto px25" color="success" htmlType="submit" size="large">
                Lưu
              </Button>
            </Pane>
          </div>
        </Form>
      </Pane>
    </>
  );
});

export default General;

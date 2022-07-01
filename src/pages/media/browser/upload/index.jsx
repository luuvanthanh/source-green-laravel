import { memo, useState, useEffect, useRef } from 'react';
import { Modal, Upload, Form } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { isEqual, size } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import csx from 'classnames';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';

import { imageUploadProps, imageUploadProp } from '@/utils/upload';
import { variables, Helper } from '@/utils';
import styles from './style.module.scss';
import imageStyles from '../style.module.scss';

const { Dragger } = Upload;

const uploadTypes = [
  { value: 'AUTO', label: 'Tự động phân loại' },
  { value: 'TARGET', label: 'Cụ thể đối tượng' },
];
const DEFAULT_TYPE = 'AUTO';

const Index = memo(({ onOk, onCancel, ...props }) => {
  const formRef = useRef();

  const dispatch = useDispatch();
  const [loading] = useSelector(({ loading: { effects } }) => [effects]);

  const [fileList, setFileList] = useState([]);
  const [students, setStudents] = useState([]);
  const [type, setType] = useState(DEFAULT_TYPE);

  const addFile = ({ file }) => {
    const { beforeUpload } = imageUploadProp;
    const result = beforeUpload(file);
    if (result) {
      setFileList((prev) => [...prev, result]);
    }
  };

  const removeFile = (removeFile) => {
    setFileList((prev) => prev.filter((file) => !isEqual(file, removeFile)));
  };

  const recordedUpload = (infoFiles) => {
    dispatch({
      type: 'mediaUpload/UPLOAD',
      payload: infoFiles,
      callback: () => {
        setFileList([]);
        onOk();
      },
    });
  };

  const recorded = (infoFiles) => {
    const { getFieldsValue } = formRef?.current;

    const req = {
      ...getFieldsValue(),
      files: infoFiles,
    };

    dispatch({
      type: 'mediaUpload/CREATE',
      payload: req,
      callback: () => {
        setFileList([]);
        onOk();
      },
    });
  };

  const upload = () => {
    dispatch({
      type: 'upload/UPLOAD_WATER_MARK',
      payload: fileList,
      showNotification: false,
      callback: ({ results = [] }) => {
        const files = results.map((result) => result?.fileInfo);
        if (type === 'AUTO') {
          recordedUpload(files);
        }
        if (type === 'TARGET') {
          recorded(files);
        }
      },
    });
  };

  const fetchStudents = () => {
    dispatch({
      type: 'categories/GET_STUDENTS',
      payload: {
        ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      },
      callback: (res) => {
        if (res) {
          setStudents(res?.items);
        }
      },
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const cancelModal = () => {
    if (
      loading['upload/UPLOAD'] ||
      loading['mediaUpload/UPLOAD'] ||
      loading['mediaUpload/CREATE']
    ) {
      return;
    }
    onCancel();
  };

  return (
    <Modal {...props} onCancel={cancelModal} title="Tải ảnh lên" width={700} footer={null}>
      <Form
        layout="vertical"
        initialValues={{
          uploadType: DEFAULT_TYPE,
        }}
        ref={formRef}
        onFinish={upload}
      >
        <div className='row'>
          <Pane className="col-lg-6">
            <FormItem
              name="uploadType"
              label="Loại tải lên"
              type={variables.RADIO}
              radioInline
              data={uploadTypes}
              onChange={({ target: { value } }) => setType(value)}
            />
          </Pane>
          {
            fileList?.length > 0 && (
              <Pane className={csx('col-lg-6', styles['wrapper-delete'])} onClick={() => setFileList([])}>
                <h3 className={styles.title}>Xoá tất cả</h3>
              </Pane>
            )
          }
        </div>

        {type === 'TARGET' && (
          <>
            <Pane>
              <FormItem
                label="Tên trẻ"
                name="studentId"
                type={variables.SELECT}
                data={students}
                options={['id', 'fullName']}
                rules={[variables.RULES.EMPTY]}
              />
            </Pane>
            <Pane>
              <FormItem label="Mô tả" name="description" type={variables.INPUT} />
            </Pane>
          </>
        )}
        <Dragger {...imageUploadProps} customRequest={addFile} multiple accept=".jpg, .jpeg, .png">
          <Pane className="text-center p20">
            <span className={csx('icon-images', styles.icon)} />
            <Text size="normal">Kéo thả hình ảnh vào đây để tải lên hoặc click vào đây</Text>
            <Text size="normal">(Chỉ gồm định dạng .JPG,.PNG. Dung lượng &lt; 5MB)</Text>
          </Pane>
        </Dragger>

        {!!fileList.length && (
          <Pane className="pt10">
            <Scrollbars autoHeight autoHeightMax={400}>
              <Pane className="row" style={{ width: 'calc(100% + 15px)' }}>
                {fileList.map((file, index) => (
                  <Pane
                    className={csx('col-lg-3 col-md-4 col-sm-6 my10', imageStyles.imageWrapper)}
                    key={index}
                  >
                    <img
                      className="d-block w-100"
                      src={window.URL.createObjectURL(file)}
                      alt={`preview${index}`}
                    />

                    <Button
                      icon="cancel"
                      className={imageStyles.close}
                      onClick={() => removeFile(file)}
                    />
                  </Pane>
                ))}
              </Pane>
            </Scrollbars>
          </Pane>
        )}
        <Pane className="pt10">
          <Button
            disabled={!size(fileList)}
            className="w-100"
            color="success"
            size="large"
            htmlType="submit"
            loading={
              loading['upload/UPLOAD'] ||
              loading['mediaUpload/UPLOAD'] ||
              loading['mediaUpload/CREATE']
            }
          >
            Tải lên
          </Button>
        </Pane>
      </Form>
    </Modal>
  );
});

Index.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

Index.defaultProps = {
  onOk: () => { },
  onCancel: () => { },
};

export default Index;

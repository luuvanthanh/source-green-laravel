import { memo, useState } from 'react'
import { Modal, Upload, notification } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars';
import { isEqual, size } from 'lodash'
import { useDispatch } from 'dva'
import csx from 'classnames'

import Pane from '@/components/CommonComponent/Pane'
import Button from '@/components/CommonComponent/Button'
import Text from '@/components/CommonComponent/Text'

import { imageUploadProps } from '@/utils/upload'
import styles from './style.module.scss'
import imageStyles from '../style.module.scss'

const { Dragger } = Upload

const Index = memo(({ onOk, ...props }) => {
  const dispatch = useDispatch()

  const [fileList, setFileList] = useState([])

  const addFile = (file) => {
    const { beforeUpload } = imageUploadProps
    const result = beforeUpload(file)
    if (result) {
      setFileList(prev => [...prev, result])
    }
  }

  const removeFile = (removeFile) => {
    setFileList(prev => prev.filter(file => !isEqual(file,removeFile)))
  }

  const upload = () => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: fileList,
      showNotification: false,
      callback: ({ results = []}) => {
        recordedUpload(results.map(result => result?.fileInfo))
      }
    })
  }

  const recordedUpload = (infoFiles) => {
    dispatch({
      type: 'mediaUpload/UPLOAD',
      payload: infoFiles,
      callback: () => {
        setFileList([])
        onOk()
      }
    })
  }

  return (
    <Modal
      {...props}
      title="Tải ảnh lên"
      footer={
        <Button
          disabled={!size(fileList)}
          className="w-100"
          color="success"
          onClick={upload}
        >
          Tải lên
        </Button>
      }
      width={700}
    >
      <Dragger
        {...imageUploadProps}
        beforeUpload={addFile}
      >
        <Pane className="text-center p20">
          <span className={csx("icon-images", styles.icon)} />
          <Text size="normal">Kéo thả hình ảnh vào đây để tải lên hoặc click vào đây</Text>
          <Text size="normal">(Chỉ gồm định dạng .JPG,.PNG. Dung lượng &lt; 2MB)</Text>
        </Pane>
      </Dragger>

      {!!fileList.length && (
        <Pane className="pt10">
          <Scrollbars autoHeight autoHeightMax={400}>
            <Pane className="row" style={{ width: 'calc(100% + 15px)' }}>
              {fileList.map((file, index) => (
                <Pane
                  className={csx("col-lg-3 col-md-4 col-sm-6 my10", imageStyles.imageWrapper)}
                  key={index}
                >
                  <img
                    className="d-block w-100"
                    src={window.URL.createObjectURL(file)}
                    alt={`preview-image-${index}`}
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
    </Modal>
  )
})

export default Index

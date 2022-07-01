import { message, notification } from 'antd';

const allowImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const allowVideoTypes = ['video/mp4'];

const warningType =
  'Định dạng hình ảnh thuộc loại .JPG, .PNG .Hãy chọn file đúng định dạng yêu cầu';

const maxSize = 5 * 2 ** 20; // 5 mB

const maxSizeVideo = 20 * 2 ** 20; // 20 mB

const warningSize = 'Dung lượng hình ảnh nhỏ hơn 5MB';

const warningSizeVideo = 'Dung lượng hình ảnh, video nhỏ hơn 20MB';

export const imageUploadProps = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type)) {
      notification.error({
        message: 'Thông báo',
        description: `${warningType}`,
      });
      return null;
    }

    if (size > maxSize) {
      notification.error({
        message: 'Thông báo',
        description: `${warningSize}`,
      });
      return null;
    }

    return file;
  },
  showUploadList: false,
  fileList: [],
};

export const imageUploadProp = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type)) {
      return null;
    }

    if (size > maxSize) {
      return null;
    }

    return file;
  },
  showUploadList: false,
  fileList: [],
};

export const videoUploadProps = {
  beforeUpload: (file) => {
    const { type, size } = file;

    if (!allowImageTypes.includes(type) && !allowVideoTypes.includes(type)) {
      message.error(warningType);
      return null;
    }

    if (size > maxSizeVideo) {
      message.error(warningSizeVideo);
      return null;
    }

    return file;
  },
  showUploadList: false,
  fileList: [],
};

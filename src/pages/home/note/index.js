import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Image } from 'antd';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import AvatarTable from '@/components/CommonComponent/AvatarTable';

import variablesModules from '../variables';
import styles from '../index.scss';

let isMounted = true;
/**
 * Set isMounted
 * @param {boolean} value
 * @returns {boolean} value of isMounted
 */
const setIsMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};
/**
 * Get isMounted
 * @returns {boolean} value of isMounted
 */
const getIsMounted = () => isMounted;

@connect(({ user, loading }) => ({ user, loading }))
class NoteComponent extends PureComponent {
  formRef = React.createRef();

  constructor(props, context) {
    super(props, context);
    const { user } = props;
    this.state = {
    };
    setIsMounted(true);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    setIsMounted(false);
  }

  /**
   * Set state properties
   * @param {object} data the data input
   * @param {function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof setStateData
   */
   setStateData = (state, callback) => {
    if (!getIsMounted()) {
      return;
    }
    this.setState(state, callback);
  };

  /**
   * Function header table
   */
   header = () => {
    const images = [
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
      'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
    ]
    return [
      {
        title: 'Thời gian tạo',
        key: 'creationTime',
        className: 'min-width-140',
        width: 140,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(moment(), variables.DATE_FORMAT.TIME_DATE)}
          </Text>
        ),
      },
      {
        title: 'Nội dung',
        key: 'getOnBus',
        className: 'min-width-300',
        render: (record) => (
          <div>
            <p className="font-weight-bold font-size-14 mb5">Giữ ấm cho bé</p>
            <p className="font-size-14 mb0">Bé hay bị lạnh, nhờ các cô giúp bé luôn mang áo ấm và tránh bé đứng trước quạt gió nhé.</p>
          </div>
        ),
      },
      {
        title: 'Hình ảnh',
        key: 'image',
        className: 'min-width-200',
        width: 200,
        render: (record) => (
          <Image.PreviewGroup>
            {
              images.map((item, index) => (
                <div  key={index} className={styles['group-image']}>
                  <Image
                    width={50}
                    src={item}
                    data-viewmore={`+${images.length - 1}`}
                  />
                </div>
              ))
            }
          </Image.PreviewGroup>
        ),
      },
      {
        title: 'Phụ huynh',
        key: 'parents',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <AvatarTable
            // fileImage={Helper.getPathAvatarJson(fileImage)}
            fullName={record?.studentMaster?.farther?.fullName || record?.studentMaster?.mother?.fullName}
            size={50}
          />
        ),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        className: 'min-width-120',
        width: 120,
        render: (record) => Helper.tagStatus('', 'Đã nhận'),
      },
      {
        title: 'Giáo viên đã nhận',
        key: 'teacher',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <AvatarTable
            // fileImage={Helper.getPathAvatarJson(fileImage)}
            fullName={'Nguyễn Văn Tuyết'}
            size={50}
          />
        ),
      },
      {
        title: 'Thời gian đã nhận',
        key: 'timeReceived',
        className: 'min-width-160',
        width: 160,
        render: (record) => (
          <Text size="normal">
            {Helper.getDate(moment(), variables.DATE_FORMAT.TIME_DATE)}
          </Text>
        ),
      },
    ];
  };

  render() {
    return (
      <div className={classnames(styles['container-bus'], 'mt20')}>
        <Form>
          <div className="row">
            <div className="col-md-4 col-xl-2">
              <FormItem
                name="time"
                type={variables.RANGE_PICKER}
              />
            </div>
            <div className="col-md-4 col-xl-2">
              <FormItem
                data={[]}
                name="status"
                type={variables.SELECT}
              />
            </div>
          </div>
        </Form>
        <Table
          bordered
          columns={this.header()}
          dataSource={[{id: 1}]}
          // loading={loading}
          pagination={false}
          params={{
            header: this.header(),
            type: 'table',
          }}
          rowKey={(record) => record.id}
          scroll={{ x: '100%' }}
        />
      </div>
    );
  }
}

NoteComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

NoteComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default NoteComponent;

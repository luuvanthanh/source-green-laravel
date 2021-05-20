import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Form, Image, Checkbox } from 'antd';
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
class MedicalComponent extends PureComponent {
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
        title: 'Thời gian uống',
        key: 'creationTime',
        className: 'min-width-140',
        width: 140,
        render: (record) => 'Sau ăn sáng'
      },
      {
        title: 'Thuốc',
        key: 'image',
        className: 'min-width-300',
        width: 300,
        render: (record) => (
          <div className="d-flex align-items-center">
            <Image.PreviewGroup>
              {
                images.map((item, index) => (
                  <div className={styles['group-image']}>
                    <Image
                      key={index}
                      width={42}
                      src={item}
                      data-viewmore={`+${images.length - 1}`}
                    />
                  </div>
                ))
              }
            </Image.PreviewGroup>
            <p className="mb0 ml10">Siro Prosan</p>
          </div>
        ),
      },
      {
        title: 'Đơn vị',
        key: 'position',
        className: 'min-width-120',
        width: 120,
        render: (record) => 'Chai'
      },
      {
        title: 'Liều lượng',
        key: 'amount',
        className: 'min-width-120',
        width: 120,
        render: (record) => '5 ml'
      },
      {
        title: 'Ghi chú',
        key: 'note',
        className: 'min-width-300',
        width: 300,
        render: (record) => '',
      },
      {
        title: 'Nhận thuốc',
        key: 'getMedicine',
        align: 'center',
        className: 'min-width-120',
        render: () => <Checkbox />,
      },
      {
        title: 'Cho thuốc',
        key: 'giveMedicine',
        align: 'center',
        className: 'min-width-120',
        render: () => <Checkbox />,
      },
      {
        title: 'Ghi chú',
        key: 'noteAll',
        rowSpan: 2,
        className: 'min-width-300',
        width: 300,
        render: (record) => 'Cho bé uống thuốc đúng giờ',
        render: (value, row, index) => {
          const obj = {
            children: 'Cho bé uống thuốc đúng giờ',
            props: {
              rowSpan: index === 0 ? 2 : 0
            }
          };
          return obj;
        }
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
                type={variables.DATE_PICKER}
              />
            </div>
            <div className="col-md-4 col-xl-2">
              <FormItem
                data={[]}
                name="time"
                type={variables.SELECT}
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
          dataSource={[{id: 1}, {id: 2}]}
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

MedicalComponent.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

MedicalComponent.defaultProps = {
  dispatch: {},
  loading: {},
  location: {},
};

export default MedicalComponent;

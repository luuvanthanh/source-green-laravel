import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Loading from '@/components/CommonComponent/Loading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import { Form } from 'antd';
import { Helper, variables } from '@/utils';
import classnames from 'classnames';
import _, { debounce, isEmpty } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { connect, history } from 'umi';

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
const mapStateToProps = ({ timeTablesConfig, loading }) => ({
  data: timeTablesConfig.data,
  pagination: timeTablesConfig.pagination,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  calendarComponentRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {
        fromDate: query?.fromDate
          ? moment(query?.fromDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().startOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: query?.toDate
          ? moment(query?.toDate).format(variables.DATE_FORMAT.DATE_AFTER)
          : moment().endOf('months').format(variables.DATE_FORMAT.DATE_AFTER),
        type: query.type || 'dayGridMonth',
        eventType: query.eventType || '',
      },
      details: {},
    };
    setIsMounted(true);
  }

  componentDidMount() {
    const { current } = this.calendarComponentRef;
    const { search } = this.state;
    if (current) {
      const calendarApi = current.getApi();
      calendarApi.gotoDate(moment(search.toDate).format(variables.DATE_FORMAT.DATE_AFTER));
    }
    this.onLoad();
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
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'timeTablesConfig/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch({
        ...search,
        fromDate: moment(search.fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: moment(search.toDate).format(variables.DATE_FORMAT.DATE_AFTER),
      }),
    });
  };

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearch = debounce((value, type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          [`${type}`]: value,
          page: variables.PAGINATION.PAGE,
          limit: variables.PAGINATION.PAGE_SIZE,
        },
      }),
      () => this.onLoad(),
    );
  }, 500);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDate = debounce((fromDate = moment(), toDate = moment(), type) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          type,
          fromDate: moment(fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
          toDate: moment(toDate).format(variables.DATE_FORMAT.DATE_AFTER),
        },
      }),
      () => this.onLoad(),
    );
  }, 500);

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

  convertData = (items) => {
    if (!isEmpty(items)) {
      let array = [];
      items.forEach((item) => {
        item.eventTimetables.forEach((itemTime) => {
          const durations = moment(itemTime.endTime).diff(moment(itemTime.startTime), 'seconds');
          array = [
            ...array,
            {
              ...itemTime,
              title: itemTime.title,
              rrule: {
                freq: 'weekly',
                interval: 1,
                dtstart: Helper.joinDateTime(itemTime.startTime, itemTime.startTime),
                until: Helper.joinDateTime(itemTime.endTime, itemTime.endTime),
              },
              duration: moment.utc(durations * 1000).format(variables.DATE_FORMAT.TIME_FULL),
            },
          ];
        });
      });
      return array;
    }
    return [];
  };

  handleEventClick = (values) => {
    const valuesDetail = {
      ..._.get(values, 'event._def.extendedProps'),
      ..._.get(values, 'event._def'),
      startDate: values?.event?.startStr || '',
      endDate: values?.event?.endStr || '',
    };
    this.setStateData({ isOpen: true, details: valuesDetail });
  };

  cancelModal = () => {
    this.setStateData({ isOpen: false, details: {} });
  };

  redirectDetails = (pathname, key) => {
    const { details } = this.state;
    if (!details?.publicId) {
      return;
    }
    history.push(`${pathname}/${details?.publicId}/${key}`);
  };

  remove = () => {
    const { details } = this.state;
    if (!details?.publicId) {
      return;
    }
    Helper.confirmAction({
      callback: () => {
        this.props.dispatch({
          type: 'timeTablesConfig/REMOVE',
          payload: {
            id: details?.publicId,
          },
          callback: (response) => {
            if (response) {
              this.setStateData({ isOpen: false });
              this.onLoad();
              this.setStateData({ details: {} });
            }
          },
        });
      },
    });
  };

  render() {
    return (
      <>
        <Helmet title="Cấu hình thời gian" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Cấu hình thời gian</Text>
          </div>
          <Form
            className={styles['layout-form']}
            layout="vertical"
            ref={this.formRef}
            onFinish={this.onFinish}
            onValuesChange={this.formUpdate}
          >
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className={styles['content-form']}>
                  <Loading>
                    <div className={classnames(styles['content-children'], 'mt0')}>
                      <Text color="dark" size="large-medium">
                        Thông tin thêm mới
                      </Text>
                      <div className="row mt-4">
                        <div className="col-lg-4">
                          <FormItem
                            label="Thời gian học từ"
                            name="contractNumber"
                            type={variables.TIME_PICKER}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </div>
                        <div className="col-lg-4">
                          <FormItem
                            label="Thời gian học đến"
                            name="contractDate"
                            type={variables.TIME_PICKER}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </div>
                        <div className="col-lg-4">
                          <FormItem
                            label="Số phút một tiết học"
                            name="typeOfContractId"
                            type={variables.INPUT}
                            rules={[variables.RULES.EMPTY]}
                          />
                        </div>
                      </div>
                    </div>
                  </Loading>
                  <div className="row">
                    <div className="col-lg-12 mt-4 d-flex justify-content-end">
                      <Button color="green" icon="save" htmlType="submit" size="large">
                        LƯU
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  location: {},
};

export default Index;

import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce, get, head } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

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
const mapStateToProps = ({ healthStaticstic, loading, user }) => ({
  loading,
  data: healthStaticstic.data,
  pagination: healthStaticstic.pagination,
  branches: healthStaticstic.branches,
  classes: healthStaticstic.classes,
  students: healthStaticstic.students,
  defaultBranch: user.defaultBranch,
  criteriaGroupProperties: healthStaticstic.criteriaGroupProperties,
  user: user.user,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
      defaultBranch,
      user
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        classId: query.classId || user?.role === "Teacher" && head(user?.objectInfo?.classTeachers)?.classId,
        studentId: query.studentId,
        propertyId: query.propertyId,
        branchId: query.branchId || defaultBranch?.id,
        fromDate:
          query?.fromDate && moment(query?.fromDate).format(variables.DATE_FORMAT.DATE_AFTER),
        toDate: query?.toDate && moment(query?.toDate).format(variables.DATE_FORMAT.DATE_AFTER),
      },
      series: [
        {
          name: 'Thống kê sức khỏe',
          data: [],
        },
      ],
      options: {
        chart: {
          height: 650,
          type: 'scatter',
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ['#27A600'],
        dataLabels: {
          enabled: false,
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            formatter: (value) => moment(value).format('DD/MM'),
          },
        },
        yaxis: {
          labels: {
            show: true,
            align: 'right',
            minWidth: 0,
            maxWidth: 160,
            offsetX: 0,
            offsetY: 0,
            rotate: 0,
            formatter: (value) => moment().startOf('day').seconds(value).format('HH:mm'),
          },
        },
      },
    };
    setIsMounted(true);
  }

  componentDidMount() {
    this.onLoad();
    this.loadCategories();
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

  getMiliseconds = (date) => {
    const a = date.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    return seconds;
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
      type: 'healthStaticstic/GET_DATA',
      payload: {
        ...search,
      },
      callback: (response) => {
        if (response) {
          let items = [];
          response.forEach((item) => {
            item.history.forEach((itemHistory) => {
              items = [
                ...items,
                [
                  new Date(item.reportDate).getTime(),
                  this.getMiliseconds(
                    Helper.getDate(get(itemHistory, 'changeTime'), variables.DATE_FORMAT.TIME_FULL),
                  ),
                ],
              ];
            });
          });

          this.setStateData({
            series: [
              {
                name: 'Thống kê sức khỏe',
                data: items,
              },
            ],
          });
        }
      },
    });
    history.push({
      pathname,
      query: Helper.convertParamSearch(search),
    });
  };

  /**
   * Function load data
   */
  loadCategories = () => {
    const { search } = this.state;
    const { defaultBranch } = this.props;
    if (search.branchId) {
      this.props.dispatch({
        type: 'healthStaticstic/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    if (search.classId) {
      this.props.dispatch({
        type: 'healthStaticstic/GET_STUDENTS',
        payload: {
          classStatus: 'HAS_CLASS',
          class: search.classId,
        },
      });
    }
    if (!defaultBranch?.id) {
      this.props.dispatch({
        type: 'healthStaticstic/GET_BRANCHES',
        payload: {},
      });
    }

    this.props.dispatch({
      type: 'healthStaticstic/GET_CRITERIA_GROUP_PROPERTIES',
      payload: {},
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
  }, 300);

  /**
   * Function debounce search
   * @param {string} value value of object search
   * @param {string} type key of object search
   */
  debouncedSearchDateRank = debounce((fromDate, toDate) => {
    this.setStateData(
      (prevState) => ({
        search: {
          ...prevState.search,
          fromDate,
          toDate,
        },
      }),
      () => this.onLoad(),
    );
  }, 200);

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (e, type) => {
    this.debouncedSearch(e.target.value, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

  /**
   * Function change select
   * @param {object} e value of select
   * @param {string} type key of object search
   */
  onChangeSelectBranch = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'healthStaticstic/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
  };

  onChangeSelectClass = (e, type) => {
    this.debouncedSearch(e, type);
    this.props.dispatch({
      type: 'healthStaticstic/GET_STUDENTS',
      payload: {
        classStatus: 'HAS_CLASS',
        class: e,
      },
    });
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDate = (e, type) => {
    this.debouncedSearch(moment(e).format(variables.DATE_FORMAT.DATE_AFTER), type);
  };

  /**
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChangeDateRank = (e) => {
    this.debouncedSearchDateRank(
      moment(e[0]).format(variables.DATE_FORMAT.DATE_AFTER),
      moment(e[1]).format(variables.DATE_FORMAT.DATE_AFTER),
    );
  };

  /**
   * Function set pagination
   * @param {integer} page page of pagination
   * @param {integer} size size of pagination
   */
  changePagination = ({ page, limit }) => {
    this.setState(
      (prevState) => ({
        search: {
          ...prevState.search,
          page,
          limit,
        },
      }),
      () => {
        this.onLoad();
      },
    );
  };

  hms = (seconds) =>
    [3600, 60]
      .reduceRight(
        (p, b) => (r) => [Math.floor(r / b)].concat(p(r % b)),
        (r) => [r],
      )(seconds)
      .map((a) => a.toString().padStart(2, '0'))
      .join(':');

  render() {
    const { students, branches, classes, criteriaGroupProperties, defaultBranch, user } = this.props;
    const { search, defaultBranchs } = this.state;
    return (
      <>
        <Helmet title="Thống kê sức khỏe" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Thống kê sức khỏe</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                date: search.fromDate &&
                  search.toDate && [moment(search.fromDate), moment(search.toDate)],
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={branches}
                      name="branchId"
                      placeholder="Chọn cơ sở"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                {defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={defaultBranchs}
                      name="branchId"
                      placeholder="Chọn cơ sở"
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <FormItem
                    data={user?.role === "Teacher" ? [...classes?.filter(i => i?.id === head(user?.objectInfo?.classTeachers)?.classId)] : [{ name: 'Chọn tất cả lớp', id: null }, ...classes]}
                    name="classId"
                    placeholder="Chọn lớp"
                    onChange={(event) => this.onChangeSelectClass(event, 'classId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={Helper.convertSelectUsers(students)}
                    name="studentId"
                    placeholder="Chọn học sinh"
                    onChange={(event) => this.onChangeSelect(event, 'studentId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-3">
                  <FormItem
                    data={criteriaGroupProperties
                      .filter((item) => item.property === 'PIPI' || item.property === 'PUPU')
                      .map((item) => ({
                        id: item.id,
                        name: item.property,
                      }))}
                    name="propertyId"
                    placeholder="Chọn loại"
                    onChange={(event) => this.onChangeSelect(event, 'propertyId')}
                    type={variables.SELECT}
                  />
                </div>
                <div className="col-lg-6">
                  <FormItem
                    name="date"
                    onChange={(event) => this.onChangeDateRank(event, 'date')}
                    type={variables.RANGE_PICKER}
                  />
                </div>
              </div>
            </Form>
            <Text color="dark">
              {criteriaGroupProperties?.find((item) => item.id === search.propertyId)?.property}
            </Text>
            <div id="chart">
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="scatter"
                height={600}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  criteriaGroupProperties: PropTypes.arrayOf(PropTypes.any),
  students: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  dispatch: {},
  location: {},
  criteriaGroupProperties: [],
  students: [],
  branches: [],
  classes: [],
  defaultBranch: {},
  user: {},
};

export default Index;

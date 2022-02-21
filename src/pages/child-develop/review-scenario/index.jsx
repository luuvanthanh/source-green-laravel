import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form, Tag, Switch } from 'antd';
import { get, debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import stylesModule from './styles.module.scss';
import variablesModules from './variables';


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
const mapStateToProps = ({ childDevelopReviewScenario, loading }) => ({
  data: childDevelopReviewScenario.data,
  error: childDevelopReviewScenario.error,
  pagination: childDevelopReviewScenario.pagination,
  skill: childDevelopReviewScenario.skill,
  loading,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      location: { query },
    } = props;
    this.state = {
      search: {
        key: query?.key,
        page: query?.page || variables.PAGINATION.PAGE,
        limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
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

  /**
   * Function load data
   */
  onLoad = () => {
    const { search } = this.state;
    const {
      location: { pathname },
    } = this.props;
    this.props.dispatch({
      type: 'childDevelopReviewScenario/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  loadCategories = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'childDevelopReviewScenario/GET_SKILL',
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
   * Function change input
   * @param {object} e event of input
   * @param {string} type key of object search
   */
  onChange = (e, type) => {
    this.debouncedSearch(e.target.value, type);
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

  /**
   * Function pagination of table
   * @param {object} pagination value of pagination items
   */
  pagination = (pagination) =>
    Helper.paginationLavarel({
      pagination,
      callback: (response) => {
        this.changePagination(response);
      },
    });

  /**
 * Function remove items
 * @param {uid} id id of items
 */
  onRemove = (id) => {
    const { dispatch } = this.props;
    const self = this;
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'childDevelopReviewScenario/REMOVE',
          payload: {
            id,
          },
          callback: (response) => {
            if (response) {
              self.onLoad();
            }
          },
        });
      },
    });
  };

  covertChildEvaluateDetail = items => {
    let array = [];
    items.forEach(({ id }) => {
      const existAssessment = items.find(item => item.inputAssessment && item.id === id);
      const existPeriodicAssessment = items.find(item => item.periodicAssessment && item.id === id);
      if (existAssessment && existPeriodicAssessment) {
        array = [...array, 'Test đầu vào', 'Đánh giá định kỳ'];
      }
      if (existAssessment && !existPeriodicAssessment) {
        array = [...array, 'Test đầu vào'];
      }
      if (!existAssessment && existPeriodicAssessment) {
        array = [...array, 'Đánh giá định kỳ'];
      }
    });
    return [...new Set(array)];
  }

  /**
   * Function header table
   */
  header = () => {
    const {
      location: { pathname },
    } = this.props;
    const columns = [
      {
        title: 'STT ',
        key: 'index',
        width: 80,
        render: (text, record, index) =>
          Helper.serialOrder(this.state.search?.page, index, this.state.search?.limit),
      },
      {
        title: 'Kỹ năng',
        key: 'skill',
        className: 'min-width-150',
        width: 200,
        render: (record) => <Text size="normal">{get(record, 'categorySkill.name')}</Text>,
      },
      {
        title: 'Độ tuổi',
        key: 'age',
        width: 150,
        className: 'min-width-150',
        render: (record) => <Text size="normal">
          {record.age === '0' ? '0 - 6 ' : ""}  
          {record.age === '1' ? '6 - 9 ' : ""}  
          {record.age === '2' ? '9 - 12 ' : ""}  
          {record.age === '3' ? '12 - 18 ' : ""}  
          {record.age === '4' ? '18 - 24 ' : ""}  
          {record.age === '5' ? '24 - 30 ' : ""}  
          {record.age === '6' ? '30 - 36 ' : ""}  
          {record.age === '7' ? '36 - 50 ' : ""}  
          {record.age === '8' ? '50- 60 ' : ""}  
          Tháng</Text>,
      },
      {
        title: 'Áp dụng',
        key: 'doen_aansoek',
        width: 150,
        className: 'min-width-150',
        render: (record) => (this.covertChildEvaluateDetail(record?.childEvaluateDetail))?.map((item, index) => (
          <div className={stylesModule['wrapper-tag']}>
            <Tag size="normal" key={index}>{item}</Tag>
          </div>
        ))
      },
      {
        title: 'Sử dụng',
        dataIndex: 'use',
        width: 150,
        className: 'min-width-160',
        render: (use, record) => (
          <div
            role="presentation"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Switch
              defaultChecked={use}
              onChange={() => {
                const payload = {
                  id: record?.id,
                  use: !use,
                };
                this.props.dispatch({
                  type: 'childDevelopReviewScenario/UPDATE_USE',
                  payload,
                  callback: (response) => {
                    if (response) {
                      this.onLoad();
                    }
                  },
                });
              }}
            />
          </div>
        ),
      },
      {
        key: 'action',
        width: 100,
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="edit"
              onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
            />
            <Button color="danger" icon="remove" onClick={() => this.onRemove(record.id)} />
          </div>
        ),
      },
    ];
    return columns;
  };

  onChangeSelect = (e, type) => {
    this.debouncedSearch(e, type);
  };

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

  render() {
    const {
      error,
      data,
      skill,
      match: { params },
      pagination,
      loading: { effects },
      location: { pathname },
    } = this.props;
    console.log("data",data)
    const { search } = this.state;
    const loading = effects['childDevelopReviewScenario/GET_DATA'];
    return (
      <>
        <Helmet title="Cấu hình kịch bản đánh giá" />
        <div className='pl20 pr20 pb20'>
          <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
            <Text color="dark">Cấu hình kịch bản đánh giá</Text>
            <Button color="success" icon="plus" onClick={() => history.push(`${pathname}/tao-moi`)}>
              Thêm mới
            </Button>
          </div>
          <div className={styles['block-table']}>
            <Form
              initialValues={{
                ...search,
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="key"
                    onChange={(event) => this.onChange(event, 'key')}
                    placeholder="Nhập từ khóa"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    data={[{ name: 'Chọn tất cả kỹ năng' }, ...skill,]}
                    name="name"
                    onChange={(event) => this.onChangeSelect(event, 'CategorySkillId')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn kỹ năng"
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    data={[{ name: 'Chọn tất cả độ tuổi' }, ...variablesModules.AGE,]}
                    name="age"
                    onChange={(event) => this.onChangeSelect(event, 'age')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn độ tuổi"
                  />
                </div>
                <div className="col-lg-2">
                  <FormItem
                    data={[{ name: 'Chọn tất cả loại áp dụng' }, ...variablesModules.APPLY,]}
                    name="aplly"
                    onChange={(event) => this.onChangeSelect(event, 'apply')}
                    type={variables.SELECT}
                    allowClear={false}
                    placeholder="Chọn loại áp dụng"
                  />
                </div>
              </div>
            </Form>
            <Table
              bordered={false}
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              pagination={this.pagination(pagination)}
              error={error}
              isError={error.isError}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id}
              scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
            />
          </div>
        </div>
      </>
    );
  }
}

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  pagination: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
  skill: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  error: {},
  skill: [],
};

export default Index;

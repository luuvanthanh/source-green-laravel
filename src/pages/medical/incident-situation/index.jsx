import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Form } from 'antd';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import styles from '@/assets/styles/Common/common.scss';
import Text from '@/components/CommonComponent/Text';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import PropTypes from 'prop-types';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import HelperModules from '../utils/Helper';

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
const mapStateToProps = ({ medicalIncidentSituation, loading, user }) => ({
  loading,
  data: medicalIncidentSituation.data,
  error: medicalIncidentSituation.error,
  classes: medicalIncidentSituation.classes,
  branches: medicalIncidentSituation.branches,
  pagination: medicalIncidentSituation.pagination,
  defaultBranch: user.defaultBranch,
});
@connect(mapStateToProps)
class Index extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const {
      defaultBranch,
      location: { query },
    } = props;
    this.state = {
      defaultBranchs: defaultBranch?.id ? [defaultBranch] : [],
      search: {
        KeyWord: query?.KeyWord,
        branchId: query?.branchId || defaultBranch?.id,
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
      type: 'medicalIncidentSituation/GET_DATA',
      payload: {
        ...search,
      },
    });
    history.push(
      `${pathname}?${Helper.convertParamSearchConvert(
        {
          ...search,
          date: Helper.getDate(search.from, variables.DATE_FORMAT.DATE_AFTER),
        },
        variables.QUERY_STRING,
      )}`,
    );
  };

  /**
   * Function load branches
   */
  loadCategories = () => {
    const { dispatch } = this.props;
    const { search } = this.state;
    if (search.branchId) {
      dispatch({
        type: 'medicalIncidentSituation/GET_CLASSES',
        payload: {
          branch: search.branchId,
        },
      });
    }
    dispatch({
      type: 'medicalIncidentSituation/GET_BRACHES',
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
    const { dispatch } = this.props;
    this.debouncedSearch(e, type);
    dispatch({
      type: 'medicalIncidentSituation/GET_CLASSES',
      payload: {
        branch: e,
      },
    });
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
  pagination = (pagination) => {
    const {
      location: { query },
    } = this.props;
    return Helper.paginationNet({
      pagination,
      query,
      callback: (response) => {
        this.changePagination(response);
      },
    });
  };

  /**
   * Function header table
   */
  header = () => {

    const columns = [
      {
        title: 'Thời gian',
        dataIndex: 'created_at',
        width: 160,
        className: 'min-width-160',
        render: (value, record) => {
          if (record.items) {
            return (
              <Text size="normal">
                {record.date}
              </Text>
            );
          }
          return <Text size="normal">{Helper.getDate(value)}</Text>;
        },
      },
      {
        title: 'Học sinh',
        dataIndex: 'full_name',
        width: 150,
        className: 'min-width-150',

      },
      {
        title: 'Cơ sở',
        width: 140,
        className: 'min-width-140',
        render: (record) => <Text size="normal">{record.basis}</Text>,
      },
      {
        title: 'Lớp',
        dataIndex: 'class',
        width: 170,
        className: 'min-width-170',

      },
      {
        title: 'Sự cố',
        width: 170,
        dataIndex: 'Wound_location',
        className: 'min-width-170',
      },
      {
        title: 'Vị trí vết thương',
        dataIndex: 'Wound_location',
        key: 'price',
        width: 140,
        className: 'min-width-140',
      },
      {
        title: 'Triệu chứng',
        dataIndex: 'Symptom',
        width: 160,
        className: 'min-width-160',

      },
      {
        title: 'Hình ảnh',
        key: 'totalPrice',
        width: 140,
        className: 'min-width-140',
        render: (value, record) => {
          // if (record.date === 'TOTAL') {
          //   return <strong>TỔNG CỘNG</strong>;
          // }
          if (record.items) {
            return (
              ""
            );
          }
          return <AvatarTable
            fileImage={Helper.getPathAvatarJson(record.file_image)}
            fullName={record.name}
          />;
        },
      },
      {
        title: 'Trạng thái xử lý',
        dataIndex: 'class',
        width: 160,
        className: 'min-width-160',
      },
      {
        title: 'Cách xử lý',
        dataIndex: 'class',
        width: 140,
        className: 'min-width-140',
      },
      {
        title: 'Người xử lý',
        dataIndex: 'class',
        width: 140,
        className: 'min-width-140',
      },
    ];
    return columns;
  };

  handleCancel = () => this.setStateData({ visible: false });

  render() {
    const {
      data,
      error,
      classes,
      branches,
      pagination,
      defaultBranch,
      match: { params },
      loading: { effects },
    } = this.props;
    const { search, defaultBranchs } = this.state;
    const loading = effects['medicalIncidentSituation/GET_DATA'];
    return (
      <>
        <Helmet title="Danh mục học sinh bị sự cố" />
        <div className={classnames(styles['content-form'], styles['content-form-children'])}>
          {/* FORM SEARCH */}
          <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
            <Text color="dark">Danh mục học sinh bị sự cố</Text>
          </div>
          <div className={classnames(styles['block-table'])}>
            <Form
              initialValues={{
                ...search,
                branchId: search.branchId || null,
                classId: search.classId || null,
                date: search.date && moment(search.date),
              }}
              layout="vertical"
              ref={this.formRef}
            >
              <div className="row">
                <div className="col-lg-3">
                  <FormItem
                    name="KeyWord"
                    onChange={(event) => this.onChange(event, 'KeyWord')}
                    placeholder="Nhập từ khóa tìm kiếm"
                    type={variables.INPUT_SEARCH}
                  />
                </div>
                {!defaultBranch?.id && (
                  <div className="col-lg-3">
                    <FormItem
                      data={[{ id: null, name: 'Tất cả cơ sở ' }, ...branches]}
                      name="branchId"
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
                      onChange={(event) => this.onChangeSelectBranch(event, 'branchId')}
                      type={variables.SELECT}
                      allowClear={false}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <FormItem
                    data={[{ id: null, name: 'Tất cả lớp' }, ...classes]}
                    name="classId"
                    onChange={(event) => this.onChangeSelect(event, 'classId')}
                    type={variables.SELECT}
                    allowClear={false}
                  />
                </div>
              </div>
            </Form>
            <Table
              columns={this.header(params)}
              dataSource={data}
              loading={loading}
              error={error}
              isError={error.isError}
              childrenColumnName="noColumn"
              bordered
              pagination={this.pagination(pagination)}
              params={{
                header: this.header(),
                type: 'table',
              }}
              rowKey={(record) => record.id || record?.class?.id}
              scroll={{ x: '100%' }}
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
  branches: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  defaultBranch: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  data: [],
  pagination: {},
  loading: {},
  dispatch: {},
  location: {},
  branches: [],
  error: {},
  classes: [],
  defaultBranch: {},
};

export default Index;


// import styles from '@/assets/styles/Common/common.scss';
// import FormItem from '@/components/CommonComponent/FormItem';
// import Pane from '@/components/CommonComponent/Pane';
// import TableCus from '@/components/CommonComponent/Table';
// import Text from '@/components/CommonComponent/Text';
// import { Helper, variables } from '@/utils';
// import { Form } from 'antd';
// import classnames from 'classnames';
// import { useDispatch, useSelector } from 'dva';
// import { debounce } from 'lodash';
// import moment from 'moment';
// import { memo, useEffect, useMemo, useState } from 'react';
// import { Helmet } from 'react-helmet';
// import AvatarTable from '@/components/CommonComponent/AvatarTable';
// import { useHistory, useLocation } from 'umi';
// import stylesModule from './styles.module.scss';

// const Index = memo(() => {
//   const history = useHistory();
//   const dispatch = useDispatch();
//   const { query, pathname } = useLocation();
//   const [
//     { pagination, error, data },
//     loading,
//   ] = useSelector(({ medicalIncidentSituation, loading: { effects } }) => [medicalIncidentSituation, effects]);
//   const [search, setSearch] = useState({
//     page: query?.page || variables.PAGINATION.PAGE,
//     limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
//   });

//   const changeFilterDebouce = debounce((name, value) => {
//     setSearch((prevSearch) => ({
//       ...prevSearch,
//       page: variables.PAGINATION.PAGE,
//       limit: variables.PAGINATION.PAGE_SIZE,
//     }));
//   }, 300);

//   const changeFilter = (name) => (value) => {
//     changeFilterDebouce(name, value);
//   };

//   const onLoad = () => {
//     dispatch({
//       type: 'medicalIncidentSituation/GET_DATA',
//       payload: {
//         ...search,
      
//       },
//     });
//     history.push({
//       pathname,
//       query: Helper.convertParamSearch({
//         ...search,
       
//       }),
//     });
//   };

//   const paginationProps = useMemo(
//     () => ({
//       size: 'default',
//       total: pagination?.total || 0,
//       pageSize: variables.PAGINATION.PAGE_SIZE,
//       defaultCurrent: Number(search.page),
//       current: Number(search.page),
//       hideOnSinglePage: (pagination?.total || 0) <= 10,
//       showSizeChanger: false,
//       pageSizeOptions: false,
//       onChange: (page, limit) => {
//         setSearch((prev) => ({
//           ...prev,
//           page,
//           limit,
//         }));
//       },
//     }),
//     [pagination],
//   );

//   useEffect(() => {
//     onLoad();
//   }, [search]);

//   const columns = () => {

//     const columns = [
//       {
//         title: 'Thời gian',
//         dataIndex: 'created_at',
//         width: 160,
//         className: 'min-width-160',
//         render: (value, record) => {
//           if (record.items) {
//             return (
//               <Text size="normal">
//                 {record.date}
//               </Text>
//             );
//           }
//           return <Text size="normal">{Helper.getDate(value)}</Text>;
//         },
//       },
//       {
//         title: 'Học sinh',
//         dataIndex: 'full_name',
//         width: 150,
//         className: 'min-width-150',

//       },
//       {
//         title: 'Cơ sở',
//         width: 140,
//         className: 'min-width-140',
//         render: (record) => <Text size="normal">{record.basis}</Text>,
//       },
//       {
//         title: 'Lớp',
//         dataIndex: 'class',
//         width: 170,
//         className: 'min-width-170',

//       },
//       {
//         title: 'Sự cố',
//         width: 170,
//         dataIndex: 'Wound_location',
//         className: 'min-width-170',
//       },
//       {
//         title: 'Vị trí vết thương',
//         dataIndex: 'Wound_location',
//         key: 'price',
//         width: 140,
//         className: 'min-width-140',
//       },
//       {
//         title: 'Triệu chứng',
//         dataIndex: 'Symptom',
//         width: 160,
//         className: 'min-width-160',

//       },
//       {
//         title: 'Hình ảnh',
//         key: 'totalPrice',
//         width: 140,
//         className: 'min-width-140',
//         render: (value, record) => {
//           // if (record.date === 'TOTAL') {
//           //   return <strong>TỔNG CỘNG</strong>;
//           // }
//           if (record.items) {
//             return (
//               ""
//             );
//           }
//           return <AvatarTable
//             fileImage={Helper.getPathAvatarJson(record.file_image)}
//             fullName={record.name}
//           />;
//         },
//       },
//       {
//         title: 'Trạng thái xử lý',
//         dataIndex: 'class',
//         width: 160,
//         className: 'min-width-160',
//       },
//       {
//         title: 'Cách xử lý',
//         dataIndex: 'class',
//         width: 140,
//         className: 'min-width-140',
//       },
//       {
//         title: 'Người xử lý',
//         dataIndex: 'class',
//         width: 140,
//         className: 'min-width-140',
//       },
//     ];
//     return columns;
//   };

//   return (
//     <>
//       <Helmet title="Báo cáo tình hình sự cố của học sinh" />
//       <Pane className="p20">
//         <Pane className={classnames(styles['heading-container'])}>
//           <Text color="dark">Báo cáo tình hình sự cố của học sinh</Text>
//         </Pane>
//         <Pane className="card mt20">
//           <Pane className="p20">
//             <Form
//               layout="vertical"
//               initialValues={{
//                 range_picker: search.start_date &&
//                   search.end_date && [moment(search.start_date), moment(search.end_date)],
//               }}
//             >
//               <Pane className="row">
//                 <Pane className="col-lg-3">
//                   <FormItem
//                     type={variables.RANGE_PICKER}
//                     name="range_picker"
//                     onChange={(values) => {
//                       changeFilter('range_picker')(values);
//                     }}
//                     allowClear={false}
//                     placeholder="Nhập từ khóa tìm kiếm"
//                   />
//                 </Pane>
//                 <Pane className="col-lg-2">
//                   <FormItem
//                     // data={[{  name: 'Tất cả cơ sở' }]}
//                     name="district"
//                     type={variables.SELECT}
//                     allowClear={false}
//                     placeholder="Chọn cơ sở"
//                   />
//                 </Pane>
//                 <Pane className="col-lg-2">
//                   <FormItem
//                     // data={[{ name: 'Tất cả lớp học' }]}
//                     name="district"
//                     type={variables.SELECT}
//                     allowClear={false}
//                     placeholder="Chọn lớp học"
//                   />
//                 </Pane>
//               </Pane>
//             </Form>
//             <div className={stylesModule['wrapper-table']}>
//               <TableCus
//                 columns={columns()}
//                 dataSource={data}
//                 loading={loading['medicalIncidentSituation/GET_DATA']}
//                 isError={error.isError}
//                 defaultExpandAllRows
//                 childrenColumnName="items"
//                 rowKey={(record) => record.date || record.id}
//                 pagination={paginationProps}
//                 className="table-normal table-report"
//                 scroll={{ x: '100%', y: '60vh' }}
//                 rowClassName={(record) => {
//                   if (record.items) {
//                     return 'row-table-parent';
//                   }
//                   return '';
//                 }}
//               />
//             </div>
//           </Pane>
//         </Pane>
//       </Pane>
//     </>
//   );
// });

// export default Index;

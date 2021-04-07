import React from 'react';
import {
  Form,
  Menu,
  Input,
  Radio,
  Modal,
  Select,
  Switch,
  Upload,
  message,
  DatePicker,
  InputNumber,
  Typography,
} from 'antd';
import moment from 'moment';
import {
  EyeOutlined,
  UploadOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'umi';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { get, isEmpty } from 'lodash';

import { Helper, variables } from '@/utils'; //permissions
import localVariables from '../../utils/variables'
import ability from '@/utils/ability';

import Table from '@/components/CommonComponent/Table';
import Pane from '@/components/CommonComponent/Pane';
import Loading from '@/components/CommonComponent/Loading';
import Heading from '@/components/CommonComponent/Heading';
import ButtonCus from '@/components/CommonComponent/Button';
import SelectCus from '@/components/CommonComponent/Select';
import Authorized from '@/components/Authorized/Authorized';

import common from '@/assets/styles/Common/common.scss';
import styles from './style.module.scss';

import { description } from './data.json';

const IMAGE_URL = 'http://api-dev.erptran.projects.greenglobal.vn:11018/erptran'

const { Paragraph } = Typography;
const { confirm } = Modal;
const mapStateToProps = state => ({
  loading: state.loading,
  error: state.userAdd.error,
  reward: state.userAdd.reward,
  category: state.userAdd.category,
  dataMenu: state.userAdd.dataMenu,
  children: state.userAdd.children,
  detailsInfo: state.userAdd.details,
  insurrances: state.userAdd.insurrances,
  magneticCards: state.userAdd.magneticCards,
  detailsWorkTimes: state.userAdd.detailsWorkTimes,
  laboursContracts: state.userAdd.laboursContracts,
  detailEducations: state.userAdd.detailEducations,
  healthInsurrances: state.userAdd.healthInsurrances,
  detailsWorkHistory: state.userAdd.detailsWorkHistory,
  salaryInformations: state.userAdd.salaryInformations,
  detailsAbbaticalLeaves: state.userAdd.detailsAbbaticalLeaves,
  detailsBankInformations: state.userAdd.detailsBankInformations,
  detailsHealthInfomations: state.userAdd.detailsHealthInfomations,
  rankPositionInformations: state.userAdd.rankPositionInformations,
  detailsContactInformation: state.userAdd.detailsContactInformation,
  minutesOfAgreement: state.userAdd.minutesOfAgreement,
});
@connect(mapStateToProps)
class Index extends React.Component {
  formRef = React.createRef();

  formRefModal = React.createRef();

  constructor(props, context) {
    super(props, context);
    this.state = {
      path: '',
      files: [],
      details: {},
      positions: [],
      delete_ids: [],
      visible: false,
      previewVisible: false,
      loadingDownload: false,
    };
  }

  componentDidMount() {
    this.onLoadData();
  }

  componentDidUpdate(prevProps) {
    const {
      detailsInfo,
      magneticCards,
      detailEducations,
      detailsWorkTimes,
      match: { params },
      detailsWorkHistory,
      detailsAbbaticalLeaves,
      detailsBankInformations,
      detailsHealthInfomations,
      detailsContactInformation,
      location: {
        query: { type },
      },
    } = this.props;
    if (type !== get(prevProps, 'location.query.type')) {
      this.onLoadData();
    }
    if (detailsInfo !== prevProps.detailsInfo && !isEmpty(detailsInfo) && get(params, 'id')) {
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue({
          ...detailsInfo,
          birthday: get(detailsInfo, 'birthday')
            ? moment(get(detailsInfo, 'birthday'), variables.DATE_FORMAT.DATE_BEFORE)
            : undefined,
          date_of_issue_id_card: get(detailsInfo, 'date_of_issue_id_card')
            ? moment(get(detailsInfo, 'date_of_issue_id_card'), variables.DATE_FORMAT.DATE_BEFORE)
            : undefined,
        });
        this.onSetPath(get(detailsInfo, 'avatar') || undefined);
      }
    }
    if (
      detailEducations !== prevProps.detailEducations &&
      !isEmpty(detailEducations) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.LEVEL
    ) {
      this.formRef.current.setFieldsValue({
        level: detailEducations.map((item, index) => ({
          ...item,
          key: index,
          date_of_issue: item.date_of_issue ? moment(item.date_of_issue) : undefined,
        })),
      });
    }
    if (
      detailEducations !== prevProps.detailEducations &&
      !isEmpty(detailEducations) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.CERTIFICAIE
    ) {
      this.formRef.current.setFieldsValue({
        certificate: detailEducations.map((item, index) => ({
          ...item,
          key: index,
          date_of_issue: item.date_of_issue ? moment(item.date_of_issue) : undefined,
        })),
      });
    }
    if (
      detailsWorkHistory !== prevProps.detailsWorkHistory &&
      !isEmpty(detailsWorkHistory) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.HISTORY
    ) {
      this.formRef.current.setFieldsValue({
        history: detailsWorkHistory.map((item, index) => ({
          key: index,
          id: item.id,
          company: `${item.company}`,
          position: `${item.position}`,
          end_date: item.end_date ? moment(item.end_date) : undefined,
          start_date: item.start_date ? moment(item.start_date) : undefined,
        })),
      });
    }
    if (
      detailsHealthInfomations !== prevProps.detailsHealthInfomations &&
      !isEmpty(detailsHealthInfomations) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.HEALTH
    ) {
      this.formRef.current.setFieldsValue({
        ...detailsHealthInfomations[0],
      });
    }
    if (
      detailsBankInformations !== prevProps.detailsBankInformations &&
      !isEmpty(detailsBankInformations) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.BANK
    ) {
      this.formRef.current.setFieldsValue({
        ...detailsBankInformations[0],
      });
    }
    if (
      detailsAbbaticalLeaves !== prevProps.detailsAbbaticalLeaves &&
      !isEmpty(detailsAbbaticalLeaves) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.DAYS_OFF
    ) {
      this.formRef.current.setFieldsValue({
        ...detailsAbbaticalLeaves[0],
      });
    }
    if (
      detailsContactInformation !== prevProps.detailsContactInformation &&
      !isEmpty(detailsContactInformation) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.CONTACT
    ) {
      this.formRef.current.setFieldsValue({
        ...detailsContactInformation[0],
      });
    }
    if (
      detailsWorkTimes !== prevProps.detailsWorkTimes &&
      !isEmpty(detailsWorkTimes) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.TIME_WORK
    ) {
      this.formRef.current.setFieldsValue({
        ...detailsWorkTimes.map(item => ({
          start_date: item.start_date ? moment(item.start_date) : undefined,
          sign_date: item.sign_date ? moment(item.sign_date) : undefined,
        }))[0],
      });
    }
    if (
      magneticCards !== prevProps.magneticCards &&
      !isEmpty(magneticCards) &&
      get(params, 'id') &&
      type === localVariables.TYPE_USER.MAGNETIC_CARDS
    ) {
      this.formRef.current.setFieldsValue({
        card: magneticCards[0].card,
      });
    }
  }

  onRemoveFiles = files => {
    this.setState(prevState => ({
      files: prevState.files.filter(item => item.path !== files),
    }));
  };

  onSetPath = path => {
    this.setState({ path: path || {} });
  };

  onStorage = () => {
    const {
      dispatch,
      detailsInfo,
      match: { params },
    } = this.props;
    if (get(params, 'id')) {
      confirm({
        okText: 'Có',
        centered: true,
        cancelText: 'Không',
        title: 'XÁC NHẬN',
        icon: <ExclamationCircleOutlined />,
        content: `Bạn có chắc chắn muốn lưu trữ ${get(detailsInfo, 'full_name')} không?`,
        onOk() {
          dispatch({
            type: 'userAdd/STORAGE',
            payload: get(params, 'id'),
          });
        },
        onCancel() {},
      });
    }
  };

  onLoadData = async () => {
    const {
      dispatch,
      match: { params },
      location: {
        query: { type },
      },
    } = this.props;
    await dispatch({
      type: 'userAdd/GET_MENU',
    });
    if (type === localVariables.TYPE_USER.INFO) {
      dispatch({
        type: 'userAdd/GET_CATEGORY',
      });
    }
    if (get(params, 'id')) {
      dispatch({
        type: 'userAdd/GET_DETAILS',
        payload: get(params, 'id'),
      });
      if (type === localVariables.TYPE_USER.LEVEL || type === localVariables.TYPE_USER.CERTIFICAIE) {
        dispatch({
          type: 'userAdd/GET_DETAIL_EDUCATIONS',
          payload: {
            id: get(params, 'id'),
            type: type === 'level' ? 'TRINH_DO_CHUYEN_MON' : 'CHUNG_CHI_CHUYEN_NGHANH',
          },
        });
      }
      if (type === localVariables.TYPE_USER.RANK) {
        await dispatch({
          type: 'userAdd/GET_CATEGORY_RANK',
        });
        await dispatch({
          type: 'userAdd/GET_DETAIL_RANK_POSITION_INFOMATIONS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.HISTORY) {
        await dispatch({
          type: 'userAdd/GET_CATEGORY_HISTORY',
        });
        await dispatch({
          type: 'userAdd/GET_DETAIL_WORK_HISTORY',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.HEALTH) {
        await dispatch({
          type: 'userAdd/GET_DETAIL_HEALTH_INFORMATIONS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.BANK) {
        await dispatch({
          type: 'userAdd/GET_DETAIL_BANK_INFORMATIONS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.DAYS_OFF) {
        await dispatch({
          type: 'userAdd/GET_DETAIL_SABBATICAL_LEAVES',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.CONTACT) {
        await dispatch({
          type: 'userAdd/GET_DETAIL_CONTACT_INFORMATIONS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.TIME_WORK) {
        await dispatch({
          type: 'userAdd/GET_DETAIL_WORK_TIMES',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.CONTRACT) {
        await dispatch({
          type: 'userAdd/GET_CATEGORY_CONTRACT',
        });
        await dispatch({
          type: 'userAdd/GET_LABOURS_CONTRACTS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT) {
        await dispatch({
          type: 'userAdd/GET_MINUTES_OF_AGREEMENT',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.INSURRANCE) {
        await dispatch({
          type: 'userAdd/GET_INSURRANCES',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.CHILDREN) {
        await dispatch({
          type: 'userAdd/GET_CHILDREN',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.SALARY) {
        await dispatch({
          type: 'userAdd/GET_SALARY_INFORMATIONS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.REWARD) {
        await dispatch({
          type: 'userAdd/GET_REWARD',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.MAGNETIC_CARDS) {
        await dispatch({
          type: 'userAdd/GET_MAGNETICCARDS',
          payload: get(params, 'id'),
        });
      }
      if (type === localVariables.TYPE_USER.INSURRANCEHEALTH) {
        await dispatch({
          type: 'userAdd/GET_CATEGORY_HEALTH',
        });
        await dispatch({
          type: 'userAdd/GET_HEALTH_INSURRANCES',
          payload: get(params, 'id'),
        });
      }
    }
  };

  onChangeDivisions = value => {
    const { category } = this.props;
    this.setState(
      () => ({
        positions: category.divisions.find(item => item.id === value)
          ? category.divisions.find(item => item.id === value).positions
          : [],
      }),
      () => {
        this.formRef.current.setFieldsValue({
          position_id: undefined,
        });
      },
    );
  };

  handleOk = () => {
    this.setState({
      visible: true,
    });
  };

  onRemove = id => {
    const {
      dispatch,
      location: {
        query: { type },
      },
    } = this.props;
    confirm({
      title: 'Khi xóa thì dữ liệu trước thời điểm xóa vẫn giữ nguyên?',
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: 'Có',
      cancelText: 'Không',
      content: 'Dữ liệu này đang được sử dụng, nếu xóa dữ liệu này sẽ ảnh hưởng tới dữ liệu khác?',
      onOk() {
        switch (type) {
          case localVariables.TYPE_USER.CHILDREN:
            return dispatch({
              type: 'userAdd/REMOVE_CHILDREN',
              payload: id,
            });
          case localVariables.TYPE_USER.CONTRACT:
            return dispatch({
              type: 'userAdd/REMOVE_LABOURS_CONTRACT',
              payload: id,
            });
          case localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT:
            return dispatch({
              type: 'userAdd/REMOVE_MINUTES_OF_AGREEMENT',
              payload: id,
            });
          case localVariables.TYPE_USER.INSURRANCE:
            return dispatch({
              type: 'userAdd/REMOVE_INSURRANCES',
              payload: id,
            });
          case localVariables.TYPE_USER.INSURRANCEHEALTH:
            return dispatch({
              type: 'userAdd/REMOVE_HEALTH_INSURRANCES',
              payload: id,
            });
          case localVariables.TYPE_USER.RANK:
            return dispatch({
              type: 'userAdd/REMOVE_RANK_POSITION_INFORMATIONS',
              payload: id,
            });
          case localVariables.TYPE_USER.REWARD:
            return dispatch({
              type: 'userAdd/REMOVE_REWARD',
              payload: id,
            });
          default:
            return dispatch({
              type: 'userAdd/REMOVE_SALARY_INFORMATION',
              payload: id,
            });
        }
      },
      onCancel() {},
    });
  };

  onEdit = id => {
    const {
      dispatch,
      location: {
        query: { type },
      },
    } = this.props;
    if (type === localVariables.TYPE_USER.RANK) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_RANK_POSITION_INFORMATION',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
              },
              () => {
                this.onChangeDivisions(get(response, 'division.id'));
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    wage: get(response, 'wage'),
                    role_id: get(response, 'role.id'),
                    rank_id: get(response, 'rank.id'),
                    store_id: get(response, 'store.id'),
                    start_date: moment(response.start_date),
                    position_id: get(response, 'position.id'),
                    division_id: get(response, 'division.id'),
                    work_form_id: get(response, 'workForm.id'),
                    days_off_month: get(response, 'days_off_month'),
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.CONTRACT) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_LABOURS_CONTRACTS',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
                files: response.files || [],
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    labours_contract_category_id: `${response.labours_contract_category_id}`,
                    sign_date: response.sign_date ? moment(response.sign_date) : undefined,
                    start_date: response.start_date ? moment(response.start_date) : undefined,
                    expiration_date: response.expiration_date
                      ? moment(response.expiration_date)
                      : undefined,
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_MINUTEST_OF_AGREEMENT',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
                files: response.files || [],
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    labours_contract_category_id: `${response.labours_contract_category_id}`,
                    sign_date: response.sign_date ? moment(response.sign_date) : undefined,
                    start_date: response.start_date ? moment(response.start_date) : undefined,
                    expiration_date: response.expiration_date
                      ? moment(response.expiration_date)
                      : undefined,
                    time_start_probation: response.time_start_probation
                      ? moment(response.time_start_probation)
                      : undefined,
                    time_end_probation: response.time_end_probation
                      ? moment(response.time_end_probation)
                      : undefined,
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.INSURRANCE) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_INSURRANCES',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    time_join: response.time_join && moment(response.time_join),
                    time_stop: response.time_join && moment(response.time_stop),
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.INSURRANCEHEALTH) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_HEALTH_INSURRANCES',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    beneficiary_id: get(response, 'beneficiary.id'),
                    start_time: moment(response.start_time),
                    end_time: moment(response.end_time),
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.CHILDREN) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_CHILDREN',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    birthday: moment(response.birthday),
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.SALARY) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_SALARY_INFORMATIONS',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    ...response,
                    time_application: moment(response.time_application),
                    wage: response.wage ? `${response.wage}` : undefined,
                  });
                }
              },
            );
          }
        },
      });
    }
    if (type === localVariables.TYPE_USER.REWARD) {
      return dispatch({
        type: 'userAdd/GET_DETAILS_REWARD',
        payload: id,
        callback: response => {
          if (response) {
            this.setState(
              {
                visible: true,
                details: response,
                files: response.files || [],
              },
              () => {
                if (this.formRefModal.current) {
                  this.formRefModal.current.setFieldsValue({
                    date: moment(response.date),
                    bonus: +response.bonus,
                    reason: response.reason,
                  });
                }
              },
            );
          }
        },
      });
    }
    return null;
  };

  onExportDocx = async record => {
    await this.setState({
      loadingDownload: true,
    });
    await Helper.exportExcel(
      `/v1/user/labours-contracts-export-word/${record.id}`,
      {},
      'HopDongLaoDong.docx',
    );
    await this.setState({
      loadingDownload: false,
    });
  };

  onExportDocxMinutesOfAgreement = async record => {
    await this.setState({
      loadingDownload: true,
    });
    await Helper.exportExcel(
      `/v1/user/minutes-of-agreement-export-word/${record.id}`,
      {},
      'BienBanThoaThuan.docx',
    );
    await this.setState({
      loadingDownload: false,
    });
  };

  header = (type = '') => {
    const { loadingDownload } = this.state;
    if (type === localVariables.TYPE_USER.INSURRANCEHEALTH) {
      const arrayHeader = [
        {
          title: 'STT',
          key: 'text',
          width: 100,
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Số BH',
          key: 'insurrance_number',
          render: record => get(record, 'insurrance_number'),
        },
        {
          title: 'Người thụ hưởng',
          key: 'beneficiary',
          render: record => get(record, 'beneficiary.name'),
        },
        {
          title: 'Ngày bắt đầu',
          key: 'start_time',
          render: record => Helper.getDate(get(record, 'start_time'), variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Ngày kết thúc',
          key: 'end_time',
          render: record => Helper.getDate(get(record, 'end_time'), variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Trạng thái',
          key: 'status',
          render: record =>
            Helper.getStatusInsurrance(
              moment(get(record, 'start_time')),
              moment(get(record, 'end_time')),
            ),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="children"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                  // isPermisssion
                  action="delete"
                  subject="children"
                >
                  Xóa
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'insurrances') && !ability.can('delete', 'insurrances')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    if (type === localVariables.TYPE_USER.INSURRANCE) {
      const arrayHeader = [
        {
          title: 'STT',
          key: 'text',
          width: 60,
          align: 'center',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Số sổ BHXH',
          key: 'insurrance_number',
          className: 'min-width-100',
          render: record => get(record, 'insurrance_number'),
        },
        {
          title: 'Mức lương đóng BHXH',
          key: 'insurance_salary',
          className: 'min-width-100',
          render: record => Helper.getPrice(record?.insurance_salary),
        },
        {
          title: 'Phụ cấp tiền',
          key: 'money_allowance',
          className: 'min-width-100',
          render: record => Helper.getPrice(record?.money_allowance),
        },
        {
          title: 'Thời gian tham gia',
          key: 'time_join',
          render: record => Helper.getDate(record.time_join, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Thời gian ngừng đóng',
          key: 'time_stop',
          render: record => Helper.getDate(record.time_stop, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Ghi chú',
          key: 'note',
          render: record => get(record, 'note'),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="children"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                  // isPermisssion
                  action="delete"
                  subject="children"
                >
                  Xóa
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'insurrances') && !ability.can('delete', 'insurrances')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    if (type === localVariables.TYPE_USER.RANK) {
      const arrayHeader = [
        {
          title: 'STT',
          key: 'text',
          width: 100,
          align: 'center',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Chi nhánh',
          key: 'store_id',
          render: record => get(record, 'store.name'),
        },
        {
          title: 'Bộ phận',
          key: 'division_id',
          render: record => get(record, 'division.name'),
        },
        {
          title: 'Chức vụ',
          key: 'position_id',
          render: record => get(record, 'position.name'),
        },
        {
          title: 'Hình thức làm việc',
          key: 'work_form_id',
          render: record => get(record, 'workForm.name'),
        },
        {
          title: 'Cấp bậc',
          key: 'rank_id',
          render: record => get(record, 'rank.name'),
        },
        {
          title: 'Vai trò',
          key: 'role_id',
          render: record => get(record, 'role.name'),
        },
        {
          title: 'Ngày bắt đầu',
          key: 'start_date',
          render: record => Helper.getDate(record?.start_date, variables.DATE_FORMAT.DATE_BEFORE),
        },
        {
          title: 'Trạng thái',
          key: 'status',
          render: record =>
            Helper.getStatusRanks(
              moment(record.start_date),
              record.end_date ? moment(record.end_date) : moment(),
            ),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="insurrances"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record)}
                  // isPermisssion
                  action="delete"
                  subject="insurrances"
                >
                  Xóa
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'insurrances') && !ability.can('delete', 'insurrances')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    if (type === localVariables.TYPE_USER.CHILDREN) {
      const arrayHeader = [
        {
          title: 'STT',
          key: 'text',
          width: 100,
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Họ tên con',
          key: 'full_name',
          render: record => get(record, 'full_name'),
        },
        {
          title: 'Giới tính',
          key: 'insurance_salary',
          render: record => Helper.getGender(get(record, 'gender')),
        },
        {
          title: 'Ngày sinh',
          key: 'birthday',
          render: record => Helper.getDate(record?.birthday, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="insurrances"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                  // isPermisssion
                  action="delete"
                  subject="insurrances"
                >
                  Xóa
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'insurrances') && !ability.can('delete', 'insurrances')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    if (type === localVariables.TYPE_USER.SALARY) {
      return [
        {
          title: 'STT',
          key: 'text',
          width: 50,
          align: 'center',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Thời gian áp dựng',
          key: 'time_application',
          className: 'min-width-120',
          render: record => Helper.getDate(record?.time_application, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Mức lương',
          key: 'wage',
          render: record => Helper.getPrice(record.wage),
        },
        {
          title: 'Hình thức chi trả',
          key: 'payments',
          render: record => Helper.getPayments(get(record, 'payments')),
        },
        {
          title: 'Trạng thái',
          key: 'status',
          render: record => Helper.getStatusPayments(get(record, 'status')),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus color="accept" ghost onClick={() => this.onEdit(record.id)}>
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                >
                  Xóa
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
    }
    if (type === localVariables.TYPE_USER.REWARD) {
      const arrayHeader = [
        {
          title: 'STT',
          key: 'text',
          width: 100,
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Ngày',
          key: 'date',
          render: record => Helper.getDate(record.date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Mức thưởng',
          key: 'bonus',
          render: record => Helper.getPrice(get(record, 'bonus')),
        },
        {
          title: 'Lý do',
          key: 'reason',
          render: record => get(record, 'reason'),
        },
        {
          title: 'File đính kèm',
          key: 'files',
          className: classnames('min-width-120', 'max-width-120'),
          render: record =>
            get(record, 'files') &&
            get(record, 'files', []).map((item, index) => (
              <Paragraph ellipsis key={index}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.file_name}
                  href={`${IMAGE_URL}/${item.path}`}
                  className={common.text}
                >
                  <PaperClipOutlined className={common.icon} />
                  {item.file_name}
                </a>
              </Paragraph>
            )),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="reward"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                  // isPermisssion
                  action="delete"
                  subject="reward"
                >
                  Xóa
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'reward') && !ability.can('delete', 'reward')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    if (type === localVariables.TYPE_USER.CONTRACT) {
      const arrayHeader = [
        {
          title: 'Stt',
          key: 'text',
          width: 60,
          className: 'min-width-60',
          align: 'center',
          fixed: 'left',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Số hợp đồng',
          key: 'contract_number',
          className: 'min-width-120',
          fixed: 'left',
          render: record => get(record, 'contract_number'),
        },
        {
          title: 'Loại hợp đồng',
          key: 'contract_category',
          render: record => get(record, 'labourContractCategory.name'),
        },
        {
          title: 'Ngày ký',
          key: 'date',
          className: 'min-width-150',
          render: record => Helper.getDate(record.sign_date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Ngày hiệu lực',
          key: 'date',
          className: 'min-width-150',
          render: record => Helper.getDate(record.start_date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Ngày hết hạn',
          key: 'deadline',
          className: 'min-width-150',
          render: record => Helper.getDate(record.expiration_date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Trạng thái',
          key: 'status',
          className: 'min-width-120',
          render: record =>
            Helper.getStatusContracts(
              moment(get(record, 'sign_date')),
              moment(get(record, 'expiration_date')),
            ),
        },
        {
          title: 'File đính kèm',
          key: 'fileName',
          className: classnames('min-width-120', 'max-width-120'),
          render: record =>
            record?.files?.map((item, index) => (
              <Paragraph ellipsis key={index}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.file_name}
                  href={`${IMAGE_URL}/${item.path}`}
                  className={common.text}
                >
                  <PaperClipOutlined className={common.icon} />
                  {item.file_name}
                </a>
              </Paragraph>
            )),
        },
        {
          title: 'Thời gian làm việc',
          key: 'work_time',
          className: 'min-width-150',
          render: record => get(record, 'work_time'),
        },
        {
          title: 'Công việc phải làm',
          key: 'work',
          className: 'min-width-150',
          render: record => get(record, 'work'),
        },
        {
          title: 'Mức lương chính',
          key: 'salary',
          className: 'min-width-150',
          render: record => get(record, 'salary'),
        },
        {
          title: 'Hình thức thanh toán',
          key: 'payment',
          className: 'min-width-150',
          render: record => get(record, 'payment'),
        },
        {
          title: 'Hình thức trả lương',
          key: 'payment_form',
          className: 'min-width-150',
          render: record => get(record, 'payment_form'),
        },
        {
          title: 'Đảm nhận vị trí',
          key: 'professional_titles',
          className: 'min-width-150',
          render: record => get(record, 'professional_titles'),
        },
        {
          title: 'Chức danh chuyên môn',
          key: 'position',
          className: 'min-width-150',
          render: record => get(record, 'position'),
        },
        {
          title: 'Bảo hiểm xã hội và bảo hiểm y tế',
          key: 'insurrance',
          className: 'min-width-150',
          render: record => get(record, 'insurrance'),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="labours-contracts"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                  // isPermisssion
                  action="delete"
                  subject="labours-contracts"
                >
                  Xóa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="primary"
                  ghost
                  icon="fe-download"
                  onClick={() => this.onExportDocx(record)}
                  loading={loadingDownload}
                  // isPermisssion
                  action="export"
                  subject="labours-contracts.word"
                >
                  Tải docx
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'labours-contracts') &&
        !ability.can('delete', 'labours-contracts')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    if (type === localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT) {
      const arrayHeader = [
        {
          title: 'Stt',
          key: 'text',
          width: 60,
          className: 'min-width-60',
          align: 'center',
          fixed: 'left',
          render: (text, record, index) => index + 1,
        },
        {
          title: 'Loại hợp đồng',
          key: 'contract_category',
          className: 'min-width-150',
          render: record => get(record, 'labours_contract_category_id'),
        },
        {
          title: 'Ngày ký',
          key: 'date',
          className: 'min-width-150',
          render: record => Helper.getDate(record.sign_date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Ngày hiệu lực',
          key: 'date',
          className: 'min-width-150',
          render: record => Helper.getDate(record.start_date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Ngày hết hạn',
          key: 'deadline',
          className: 'min-width-150',
          render: record => Helper.getDate(record.expiration_date, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Thời gian bắt đầu thử việc',
          key: 'time_start_probation',
          className: 'min-width-200',
          render: record => Helper.getDate(record.time_start_probation, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Thời gian kết thúc thử việc',
          key: 'time_end_probation',
          className: 'min-width-200',
          render: record => Helper.getDate(record.time_end_probation, variables.DATE_FORMAT.DATE),
        },
        {
          title: 'Trạng thái',
          key: 'status',
          className: 'min-width-120',
          render: record =>
            Helper.getStatusContracts(
              moment(get(record, 'sign_date')),
              moment(get(record, 'expiration_date')),
            ),
        },
        {
          title: 'File đính kèm',
          key: 'fileName',
          className: classnames('min-width-120', 'max-width-120'),
          render: record =>
            record?.files?.map((item, index) => (
              <Paragraph ellipsis key={index}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.file_name}
                  href={`${IMAGE_URL}/${item.path}`}
                  className={common.text}
                >
                  <PaperClipOutlined className={common.icon} />
                  {item.file_name}
                </a>
              </Paragraph>
            )),
        },
        {
          title: 'Thời gian làm việc',
          key: 'work_time',
          className: 'min-width-150',
          render: record => get(record, 'work_time'),
        },
        {
          title: 'Công việc phải làm',
          key: 'work',
          className: 'min-width-150',
          render: record => get(record, 'work'),
        },
        {
          title: 'Địa chỉ làm việc',
          key: 'work_adress',
          className: 'min-width-150',
          render: record => get(record, 'work_adress'),
        },
        {
          title: 'Mức lương chính',
          key: 'salary',
          className: 'min-width-150',
          render: record => get(record, 'salary'),
        },
        {
          title: 'Hình thức thanh toán',
          key: 'payment',
          className: 'min-width-150',
          render: record => get(record, 'payment'),
        },
        {
          title: 'Hình thức trả lương',
          key: 'payment_form',
          className: 'min-width-150',
          render: record => get(record, 'payment_form'),
        },
        {
          title: 'Đảm nhận vị trí',
          key: 'professional_titles',
          className: 'min-width-150',
          render: record => get(record, 'professional_titles'),
        },
        {
          title: 'Phần trăm được hưởng',
          key: 'percent_enjoyed',
          className: 'min-width-150',
          render: record => get(record, 'percent_enjoyed'),
        },
        {
          title: 'Thao tác',
          key: 'actions',
          width: 150,
          fixed: 'right',
          align: 'center',
          render: record => (
            <ul className="list-unstyled list-inline">
              <li className="list-inline-item">
                <ButtonCus
                  color="accept"
                  ghost
                  onClick={() => this.onEdit(record.id)}
                  // isPermisssion
                  action="update"
                  subject="minutes-of-agreement"
                >
                  Sửa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="danger"
                  ghost
                  className="ml-2"
                  onClick={() => this.onRemove(record.id)}
                  // isPermisssion
                  action="delete"
                  subject="minutes-of-agreement"
                >
                  Xóa
                </ButtonCus>
              </li>
              <li className="list-inline-item">
                <ButtonCus
                  color="primary"
                  ghost
                  icon="fe-download"
                  onClick={() => this.onExportDocxMinutesOfAgreement(record)}
                  loading={loadingDownload}
                  // isPermisssion
                  action="export"
                  subject="minutes-of-agreement.word"
                >
                  Tải docx
                </ButtonCus>
              </li>
            </ul>
          ),
        },
      ];
      return !ability.can('update', 'minutes-of-agreement') &&
        !ability.can('delete', 'minutes-of-agreement')
        ? arrayHeader.filter(item => item.key !== 'actions')
        : arrayHeader;
    }
    const arrayHeader = [
      {
        title: 'Stt',
        key: 'text',
        width: 50,
        align: 'center',
        fixed: 'left',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Số hợp đồng',
        key: 'contract_number',
        className: 'min-width-120',
        fixed: 'left',
        render: record => get(record, 'contract_number'),
      },
      {
        title: 'Loại hợp đồng',
        key: 'contract_category',
        render: record => get(record, 'labourContractCategory.name'),
      },
      {
        title: 'Ngày hiệu lực',
        key: 'date',
        render: record => Helper.getDate(record.sign_date, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Ngày hết hạn',
        key: 'deadline',
        render: record => Helper.getDate(record.expiration_date, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        render: record =>
          Helper.getStatusContracts(
            moment(get(record, 'sign_date')),
            moment(get(record, 'expiration_date')),
          ),
      },
      {
        title: 'File đính kèm',
        key: 'fileName',
        className: classnames('min-width-120', 'max-width-120'),
        render: record =>
          record?.files?.map((item, index) => (
            <Paragraph ellipsis key={index}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                title={item.file_name}
                href={`${IMAGE_URL}/${item.path}`}
                className={common.text}
              >
                <PaperClipOutlined className={common.icon} />
                {item.file_name}
              </a>
            </Paragraph>
          )),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 150,
        fixed: 'right',
        align: 'center',
        render: record => (
          <ul className="list-unstyled list-inline">
            <li className="list-inline-item">
              <ButtonCus
                color="accept"
                ghost
                onClick={() => this.onEdit(record.id)}
                // isPermisssion
                action="update"
                subject="labours-contracts"
              >
                Sửa
              </ButtonCus>
            </li>
            <li className="list-inline-item">
              <ButtonCus
                color="danger"
                ghost
                className="ml-2"
                onClick={() => this.onRemove(record.id)}
                // isPermisssion
                action="delete"
                subject="labours-contracts"
              >
                Xóa
              </ButtonCus>
            </li>
          </ul>
        ),
      },
    ];
    return !ability.can('update', 'labours-contracts') &&
      !ability.can('delete', 'labours-contracts')
      ? arrayHeader.filter(item => item.key !== 'actions')
      : arrayHeader;
  };

  onSave = async () => {
    const {
      dispatch,
      location: {
        query: { type },
      },
      match: { params },
    } = this.props;
    const { details, files } = this.state;
    if (this.formRefModal.current) {
      this.formRefModal.current.validateFields().then(values => {
        if (type === localVariables.TYPE_USER.RANK) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_RANK_POSITION_INFOMATIONS',
              payload: {
                ...values,
                id: details.id,
                user_id: get(params, 'id'),
              },
              callback: (response, error) => {
                if (response) {
                  dispatch({
                    type: 'userAdd/GET_DETAIL_RANK_POSITION_INFOMATIONS',
                    payload: get(params, 'id'),
                  });
                  this.cancelModal();
                }
                if (error) {
                  if (this.formRefModal.current) {
                    if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                      error.data.errors.forEach(item => {
                        this.formRefModal.current.setFields([
                          {
                            name: get(item, 'source.pointer'),
                            errors: [get(item, 'detail')],
                          },
                        ]);
                      });
                    }
                  }
                }
              },
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_RANK_POSITION_INFOMATIONS',
              payload: {
                ...values,
                user_id: get(params, 'id'),
              },
              callback: (response, error) => {
                if (response) {
                  dispatch({
                    type: 'userAdd/GET_DETAIL_RANK_POSITION_INFOMATIONS',
                    payload: get(params, 'id'),
                  });
                  this.cancelModal();
                }
                if (error) {
                  if (this.formRefModal.current) {
                    if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                      error.data.errors.forEach(item => {
                        this.formRefModal.current.setFields([
                          {
                            name: get(item, 'source.pointer'),
                            errors: [get(item, 'detail')],
                          },
                        ]);
                      });
                    }
                  }
                }
              },
            });
          }
        }
        if (type === localVariables.TYPE_USER.CHILDREN) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_CHILDREN',
              payload: {
                ...values,
                id: details.id,
                user_id: get(params, 'id'),
              },
            }).then(() => {
              this.cancelModal();
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_CHILDREN',
              payload: {
                ...values,
                user_id: get(params, 'id'),
              },
            }).then(() => {
              this.cancelModal();
            });
          }
        }
        if (type === localVariables.TYPE_USER.CONTRACT) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_LABOURS_CONTRACTS',
              payload: {
                ...values,
                id: details.id,
                user_id: get(params, 'id'),
                files,
              },
            }).then(() => {
              this.cancelModal();
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_LABOURS_CONTRACTS',
              payload: {
                ...values,
                user_id: get(params, 'id'),
                files,
              },
            }).then(() => {
              this.cancelModal();
            });
          }
        }
        if (type === localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_MINUTES_OF_AGREEMENT',
              payload: {
                ...values,
                id: details.id,
                user_id: get(params, 'id'),
                files,
              },
            }).then(() => {
              this.cancelModal();
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_MINUTES_OF_AGREEMENT',
              payload: {
                ...values,
                user_id: get(params, 'id'),
                files,
              },
            }).then(() => {
              this.cancelModal();
            });
          }
        }
        if (type === localVariables.TYPE_USER.SALARY) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_SALARY_INFORMATIONS',
              payload: {
                ...values,
                user_id: get(params, 'id'),
                id: details.id,
              },
            }).then(() => {
              this.cancelModal();
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_SALARY_INFORMATIONS',
              payload: {
                ...values,
                user_id: get(params, 'id'),
              },
            }).then(() => {
              this.cancelModal();
            });
          }
        }
        if (type === localVariables.TYPE_USER.INSURRANCE) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_INSURRANCES',
              payload: {
                ...values,
                user_id: get(params, 'id'),
                id: details.id,
              },
            }).then(() => {
              this.cancelModal();
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_INSURRANCES',
              payload: {
                ...values,
                user_id: get(params, 'id'),
              },
            }).then(() => {
              this.cancelModal();
            });
          }
        }
        if (type === localVariables.TYPE_USER.INSURRANCEHEALTH) {
          if (!isEmpty(details)) {
            dispatch({
              type: 'userAdd/UPDATE_HEALTH_INSURRANCES',
              payload: {
                ...values,
                user_id: get(params, 'id'),
                id: details.id,
              },
            }).then(() => {
              this.cancelModal();
            });
          } else {
            dispatch({
              type: 'userAdd/ADD_HEALTH_INSURRANCES',
              payload: {
                ...values,
                user_id: get(params, 'id'),
              },
            }).then(() => {
              this.cancelModal();
            });
          }
        }
        if (type === localVariables.TYPE_USER.REWARD) {
          dispatch({
            type: isEmpty(details) ? 'userAdd/ADD_REWARD' : 'userAdd/UPDATE_REWARD',
            payload: {
              ...values,
              user_id: get(params, 'id'),
              id: details.id,
              files,
            },
          }).then(() => {
            this.cancelModal();
          });
        }
        if (type === localVariables.TYPE_USER.INFO) {
          dispatch({
            type: 'userAdd/CHANGE_PASSWORD',
            payload: {
              ...values,
              user_id: get(params, 'id'),
            },
            callback: (response, error) => {
              if (response) this.cancelModal();
              if (error) {
                if (this.formRefModal.current) {
                  if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                    error.data.errors.forEach(item => {
                      this.formRefModal.current.setFields([
                        {
                          name: get(item, 'source.pointer'),
                          errors: [get(item, 'detail')],
                        },
                      ]);
                    });
                  }
                }
              }
            },
          });
        }
      });
    }
  };

  cancelModal = () => {
    this.setState(
      {
        visible: false,
        details: {},
        files: [],
      },
      () => {
        if (this.formRefModal.current) {
          this.formRefModal.current.resetFields();
        }
      },
    );
  };

  onFinish = values => {
    const {
      location: {
        query: { type },
      },
      dispatch,
      match: { params },
    } = this.props;
    if (type === localVariables.TYPE_USER.INFO) {
      if (get(params, 'id')) {
        dispatch({
          type: 'userAdd/UPDATE_USER',
          payload: {
            ...values,
            id: get(params, 'id'),
            avatar: this.state.path,
          },
          callback: (response, error) => {
            if (error) {
              if (this.formRef.current) {
                if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                  error.data.errors.forEach(item => {
                    this.formRef.current.setFields([
                      {
                        name: get(item, 'source.pointer'),
                        errors: [get(item, 'detail')],
                      },
                    ]);
                  });
                }
              }
            }
          },
        });
      } else {
        dispatch({
          type: 'userAdd/ADD_USER',
          payload: {
            ...values,
            avatar: this.state.path,
          },
          callback: (response, error) => {
            if (error) {
              if (this.formRef.current) {
                if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                  error.data.errors.forEach(item => {
                    this.formRef.current.setFields([
                      {
                        name: get(item, 'source.pointer'),
                        errors: [get(item, 'detail')],
                      },
                    ]);
                  });
                }
              }
            }
          },
        });
      }
    }
    if (type === localVariables.TYPE_USER.LEVEL || type === localVariables.TYPE_USER.CERTIFICAIE) {
      dispatch({
        type: 'userAdd/ADD_EDUCATIONS',
        payload: {
          user_id: get(params, 'id'),
          type: type === 'level' ? 'TRINH_DO_CHUYEN_MON' : 'CHUNG_CHI_CHUYEN_NGHANH',
          update_rows: values[type]
            .filter(item => item.id)
            .map(item => ({
              id: item.id,
              level: item.level || undefined,
              date_of_issue: item.date_of_issue || undefined,
              education_type: item.education_type || undefined,
              specialization: item.specialization || undefined,
              training_place: item.training_place || undefined,
            })),
          create_rows: values[type].filter(item => !item.id),
          delete_ids: this.state.delete_ids,
        },
      }).then(() => {
        this.setState({
          delete_ids: [],
        });
      });
    }
    if (type === localVariables.TYPE_USER.RANK) {
      dispatch({
        type: 'userAdd/ADD_RANK_POSITION_INFOMATIONS',
        payload: {
          ...values,
          user_id: get(params, 'id'),
        },
      });
    }
    if (type === localVariables.TYPE_USER.HISTORY) {
      dispatch({
        type: 'userAdd/ADD_WORK_HISTORY',
        payload: {
          user_id: get(params, 'id'),
          update_rows: values.history.filter(item => item.id),
          create_rows: values.history.filter(item => !item.id),
          delete_ids: this.state.delete_ids,
        },
      });
    }
    if (type === localVariables.TYPE_USER.HEALTH) {
      dispatch({
        type: 'userAdd/ADD_HEALTH_INFORMATIONS',
        payload: {
          ...values,
          user_id: get(params, 'id'),
        },
      });
    }
    if (type === localVariables.TYPE_USER.BANK) {
      dispatch({
        type: 'userAdd/ADD_BANK_INFORMATIONS',
        payload: {
          ...values,
          user_id: get(params, 'id'),
        },
      });
    }
    if (type === localVariables.TYPE_USER.DAYS_OFF) {
      dispatch({
        type: 'userAdd/ADD_SABBATICAL_LEAVES',
        payload: {
          ...values,
          user_id: get(params, 'id'),
        },
      });
    }
    if (type === localVariables.TYPE_USER.CONTACT) {
      dispatch({
        type: 'userAdd/ADD_CONTACT_INFORMATIONS',
        payload: {
          ...values,
          user_id: get(params, 'id'),
        },
      });
    }
    if (type === localVariables.TYPE_USER.TIME_WORK) {
      dispatch({
        type: 'userAdd/ADD_WORK_TIMES',
        payload: {
          ...values,
          user_id: get(params, 'id'),
        },
      });
    }
    if (type === localVariables.TYPE_USER.MAGNETIC_CARDS) {
      if (!isEmpty(this.props.magneticCards)) {
        dispatch({
          type: 'userAdd/UPDATE_MAGNETIC_CARD',
          payload: {
            card: values.card,
            user_id: get(params, 'id'),
            id: this.props.magneticCards[0].id,
          },
          callback: (response, error) => {
            if (error) {
              if (this.formRef.current) {
                if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                  error.data.errors.forEach(item => {
                    this.formRef.current.setFields([
                      {
                        name: get(item, 'source.pointer'),
                        errors: [get(item, 'detail')],
                      },
                    ]);
                  });
                }
              }
            }
          },
        });
      } else {
        dispatch({
          type: 'userAdd/ADD_MAGNETIC_CARD',
          payload: {
            user_id: get(params, 'id'),
            card: values.card,
          },
          callback: (response, error) => {
            if (error) {
              if (this.formRef.current) {
                if (get(error, 'data.status') === 400 && !isEmpty(error.data.errors)) {
                  error.data.errors.forEach(item => {
                    this.formRef.current.setFields([
                      {
                        name: get(item, 'source.pointer'),
                        errors: [get(item, 'detail')],
                      },
                    ]);
                  });
                }
              }
            }
          },
        });
      }
    }
  };

  onChangeCheck = (record, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userAdd/UPDATE_STATUS',
      payload: {
        id: record.id,
        status: value ? variables.STATUS.ON : variables.STATUS.OFF,
      },
    });
  };

  onChangeCheckTimeKeeping = (record, value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userAdd/UPDATE_STATUS_TIMEKEEPING',
      payload: {
        id: record.id,
        status: value,
      },
    });
  };

  renderContentForm = type => {
    const {
      category,
      loading: { effects },
      match: { params },
    } = this.props;

    const { positions, path, previewVisible } = this.state;
    const loading =
      effects['userAdd/GET_DETAILS'] ||
      effects['userAdd/GET_CATEGORY'] ||
      effects['userAdd/GET_MAGNETICCARDS'] ||
      effects['userAdd/GET_CATEGORY_RANK'] ||
      effects['userAdd/GET_CATEGORY_HISTORY'] ||
      effects['userAdd/GET_DETAIL_WORK_TIMES'] ||
      effects['userAdd/GET_DETAIL_EDUCATIONS'] ||
      effects['userAdd/GET_LABOURS_CONTRACTS'] ||
      effects['userAdd/GET_DETAIL_WORK_HISTORY'] ||
      effects['userAdd/GET_DETAIL_BANK_INFORMATIONS'] ||
      effects['userAdd/GET_DETAIL_SABBATICAL_LEAVES'] ||
      effects['userAdd/GET_DETAIL_HEALTH_INFORMATIONS'] ||
      effects['userAdd/GET_DETAIL_CONTACT_INFORMATIONS'] ||
      effects['userAdd/GET_DETAIL_RANK_POSITION_INFOMATIONS'];
    const loadingSubmit =
      effects['upload/UPLOAD'] ||
      effects['userAdd/ADD_USER'] ||
      effects['userAdd/ADD_REWARD'] ||
      effects['userAdd/UPDATE_USER'] ||
      effects['userAdd/CHANGE_PASSWORD'] ||
      effects['userAdd/ADD_WORK_TIMES'] ||
      effects['userAdd/ADD_EDUCATIONS'] ||
      effects['userAdd/UPDATED_REWARD'] ||
      effects['userAdd/UPDATE_CHILDREN'] ||
      effects['userAdd/ADD_INSURRANCES'] ||
      effects['userAdd/ADD_WORK_HISTORY'] ||
      effects['userAdd/ADD_WORK_HISTORY'] ||
      effects['userAdd/UPDATE_INSURRANCES'] ||
      effects['userAdd/UPDATE_INSURRANCES'] ||
      effects['userAdd/ADD_BANK_INFORMATIONS'] ||
      effects['userAdd/ADD_LABOURS_CONTRACTS'] ||
      effects['userAdd/ADD_SABBATICAL_LEAVES'] ||
      effects['userAdd/ADD_LABOURS_CONTRACTS'] ||
      effects['userAdd/ADD_HEALTH_INSURRANCES'] ||
      effects['userAdd/ADD_HEALTH_INFORMATIONS'] ||
      effects['userAdd/UPDATE_LABOURS_CONTRACTS'] ||
      effects['userAdd/UPDATE_HEALTH_INSURRANCES'] ||
      effects['userAdd/ADD_RANK_POSITION_INFOMATIONS'] ||
      effects['userAdd/UPDATE_RANK_POSITION_INFOMATIONS'];
    if (type === localVariables.TYPE_USER.INFO) {
      const props = {
        beforeUpload: file => {
          const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
          if (!isJpgOrPng) {
            message.error('Định dạng hình ảnh thuộc loại .JPG,.PNG');
          }
          const isLt2M = file.size / 1024 / 1024 < 5;
          if (!isLt2M) {
            message.error('Dung lượng hình ảnh nhỏ hơn 5MB');
          }
          if (isJpgOrPng && isLt2M) {
            const { dispatch } = this.props;
            dispatch({
              type: 'upload/UPLOAD',
              payload: file,
              callback: response => {
                if (response) {
                  this.setState(
                    {
                      path: {
                        path: response.path,
                        file_name: file.name,
                      },
                    },
                    () => {
                      this.formRef.current.setFieldsValue({
                        path: response,
                      });
                    },
                  );
                }
              },
            });
          }
          return file;
        },
        showUploadList: false,
        fileList: [],
      };
      return (
        <>
          <Modal
            visible={this.state.visible}
            title="Cấp mật khẩu"
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form layout="vertical" ref={this.formRefModal}>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item
                    name="password"
                    label={<span>Mật khẩu</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input.Password placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-12">
                  <Form.Item
                    name="password_confirmation"
                    label={<span>Nhập lại</span>}
                    rules={[
                      variables.RULES.EMPTY_INPUT,
                      variables.RULES.MAX_LENGTH_255,
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Hai mật khẩu không khớp với nhau. Vui lòng kiểm tra lại'),
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Nhập" />
                  </Form.Item>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Modal
            visible={previewVisible}
            title="Hình ảnh nhân viên"
            footer={null}
            onCancel={() => {
              this.setState({
                previewVisible: false,
              });
            }}
          >
            <img
              alt="avatar"
              style={{ width: '100%' }}
              className={common['image-modal']}
              src={`${IMAGE_URL}/${path.path}`}
            />
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin nhân viên</Heading>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item name="avatar" label={<span>Hình ảnh nhân viên</span>}>
                    {get(path, 'path') ? (
                      <Pane className={common['shape-image']}>
                        <img
                          src={`${IMAGE_URL}/${path.path}`}
                          alt="avatar"
                          className={common.image}
                        />
                        <Pane className={common.preview}>
                          <EyeOutlined
                            className={common.icon}
                            onClick={() =>
                              this.setState({
                                previewVisible: true,
                              })
                            }
                          />
                          <Upload {...props}>
                            <UploadOutlined className={common.icon} />
                          </Upload>
                        </Pane>
                      </Pane>
                    ) : (
                      <Upload {...props}>
                        <ButtonCus color="primary" ghost loading={loadingSubmit}>
                          <UploadOutlined /> Tải lên hình ảnh
                        </ButtonCus>
                      </Upload>
                    )}
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="full_name"
                    label={<span>Họ và tên</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="gender"
                    label={<span>Giới tính</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Bạn không được để trống trường này',
                      },
                    ]}
                  >
                    <Select allowClear placeholder="Chọn">
                      <Select.Option value="NAM">Nam</Select.Option>
                      <Select.Option value="NU">Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="birthday"
                    label={<span>Ngày sinh</span>}
                    rules={[
                      variables.RULES.EMPTY,
                      () => ({
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }
                          if (moment().isAfter(moment(value).add(1, 'days'))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian nhập vào không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn"
                      format={variables.DATE_FORMAT.DATE}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="email"
                    label={<span>Email</span>}
                    rules={[variables.RULES.EMAIL, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập email" autoComplete="new-email" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="password"
                    label={<span>Mật khẩu</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input
                      type="password"
                      placeholder={get(params, 'id') ? '***********' : 'Nhập mật khẩu'}
                      disabled={get(params, 'id')}
                      autoComplete="new-password"
                    />
                  </Form.Item>
                </Pane>
                {get(params, 'id') && (
                  <Pane className="col-lg-4">
                    <Form.Item name="button" label={<span />}>
                      <ButtonCus
                        htmlType="button"
                        color="green"
                        onClick={() =>
                          this.setState({
                            visible: true,
                          })
                        }
                      >
                        Cấp mật khẩu
                      </ButtonCus>
                    </Form.Item>
                  </Pane>
                )}
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="id_card"
                    label={<span>Số CMND</span>}
                    rules={[
                      variables.RULES.NUMBER,
                      variables.RULES.MIN9,
                      variables.RULES.MAX_LENGTH_255,
                    ]}
                  >
                    <Input placeholder="Nhập số CMND" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="date_of_issue_id_card"
                    label={<span>Ngày cấp</span>}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value) {
                            return Promise.resolve();
                          }
                          if (moment(value).diff(getFieldValue('birthday'), 'days', true) > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian nhập vào không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn"
                      format={variables.DATE_FORMAT.DATE}
                    />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="place_of_issue_id_card"
                    label={<span>Nơi cấp</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập nơi cấp" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="nation"
                    label={<span>Dân tộc</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="religion"
                    label={<span>Tôn giáo</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item name="marriage_status" label={<span>Tình trạng hôn nhân</span>}>
                    <Radio.Group>
                      <Radio value="DOC_THAN">Độc thân</Radio>
                      <Radio value="DA_KET_HON">Đã kết hôn</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Pane>
              </Pane>
              {!get(params, 'id') && (
                <>
                  <hr className={common['dot-bottom']} />
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="store_id"
                        label={<span>Chi nhánh</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <SelectCus placeholder="Chọn" showSearch dataSet={category.stores || []} />
                      </Form.Item>
                    </Pane>
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="division_id"
                        label={<span>Bộ phận</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <SelectCus
                          placeholder="Chọn"
                          showSearch
                          dataSet={category.divisions || []}
                          onChange={this.onChangeDivisions}
                        />
                      </Form.Item>
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="position_id"
                        label={<span>Chức vụ</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <SelectCus placeholder="Chọn" showSearch dataSet={positions} />
                      </Form.Item>
                    </Pane>
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="work_form_id"
                        label={<span>Hình thức làm việc</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <SelectCus placeholder="Chọn" showSearch dataSet={category.workForms || []} />
                      </Form.Item>
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="rank_id"
                        label={<span>Cấp bậc</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <SelectCus placeholder="Chọn" showSearch dataSet={category.ranks || []} />
                      </Form.Item>
                    </Pane>
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="role_id"
                        label={<span>Vai trò</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <SelectCus placeholder="Chọn" showSearch dataSet={category.roles || []} />
                      </Form.Item>
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-lg-6">
                      <Form.Item
                        name="start_date"
                        label={<span>Ngày vào làm</span>}
                        rules={[variables.RULES.EMPTY]}
                      >
                        <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                      </Form.Item>
                    </Pane>
                  </Pane>
                </>
              )}
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                htmlType="submit"
                color="green"
                loading={loading || loadingSubmit}
                icon="fe-save"
              >
                Lưu
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.LEVEL) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Trình độ chuyên môn</Heading>
              <Form.List name="level">
                {(fields, { add, remove }) => (
                  <div>
                    {fields.map(field => (
                      <Pane
                        className={classnames('row mt-2 mb-2', styles['form-item'])}
                        key={field.key}
                      >
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'level']}
                            fieldKey={[field.fieldKey, 'level']}
                            label={<span>Trình độ</span>}
                            rules={[
                              variables.RULES.EMPTY_INPUT,
                              variables.RULES.MAX_LENGTH_255,
                            ]}
                          >
                            <Input placeholder="Nhập trình độ" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'specialization']}
                            fieldKey={[field.fieldKey, 'specialization']}
                            label={<span>Chuyên ngành</span>}
                            rules={[variables.RULES.MAX_LENGTH_255]}
                          >
                            <Input placeholder="Nhập chuyên ngành" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'training_place']}
                            fieldKey={[field.fieldKey, 'training_place']}
                            label={<span>Nơi đào tạo</span>}
                            rules={[variables.RULES.MAX_LENGTH_255]}
                          >
                            <Input placeholder="Nhập nơi đào tạo" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'date_of_issue']}
                            fieldKey={[field.fieldKey, 'date_of_issue']}
                            label={<span>Ngày cấp</span>}
                          >
                            <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                          </Form.Item>
                        </Pane>
                        <>
                          {fields?.length > 1 ? (
                            <DeleteOutlined
                              className={styles['icon-delete']}
                              onClick={() => {
                                if (this.formRef.current) {
                                  const { level } = this.formRef.current.getFieldsValue();
                                  const findItem = level.find(item => item.key === field.key);
                                  if (findItem) {
                                    this.setState(prevState => ({
                                      delete_ids: [
                                        ...prevState.delete_ids,
                                        Number.parseInt(findItem.id, 10),
                                      ],
                                    }));
                                  }
                                  remove(field.name);
                                }
                              }}
                            />
                          ) : null}
                        </>
                      </Pane>
                    ))}
                    <Pane className="row">
                      <Pane className="col-lg-3">
                        <ButtonCus
                          color="primary"
                          icon="fe-plus-circle"
                          onClick={() => {
                            add();
                          }}
                        >
                          Thêm dòng
                        </ButtonCus>
                      </Pane>
                    </Pane>
                  </div>
                )}
              </Form.List>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                loading={loading || loadingSubmit}
                htmlType="submit"
                icon="fe-save"
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.CERTIFICAIE) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Chứng chỉ chuyên ngành</Heading>
              <Form.List name="certificate">
                {(fields, { add, remove }) => (
                  <Pane>
                    {fields.map(field => (
                      <Pane className={classnames('row', styles['form-item'])} key={field.key}>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'certificate_name']}
                            fieldKey={[field.fieldKey, 'certificate_name']}
                            label={<span>Tên chứng chỉ</span>}
                            rules={[
                              variables.RULES.EMPTY_INPUT,
                              variables.RULES.MAX_LENGTH_255,
                            ]}
                          >
                            <Input placeholder="Nhập tên chứng chỉ" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'certificate_type']}
                            fieldKey={[field.fieldKey, 'certificate_type']}
                            label={<span>Loại chứng chỉ</span>}
                            rules={[variables.RULES.MAX_LENGTH_255]}
                          >
                            <Input placeholder="Nhập loại chứng chỉ" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'training_place']}
                            fieldKey={[field.fieldKey, 'training_place']}
                            label={<span>Nơi đào tạo</span>}
                            rules={[variables.RULES.MAX_LENGTH_255]}
                          >
                            <Input placeholder="Nhập nơi đào tạo" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'date_of_issue']}
                            fieldKey={[field.fieldKey, 'date_of_issue']}
                            label={<span>Ngày cấp</span>}
                          >
                            <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                          </Form.Item>
                        </Pane>
                        <>
                          {fields?.length > 1 ? (
                            <DeleteOutlined
                              className={styles['icon-delete']}
                              onClick={() => {
                                if (this.formRef.current) {
                                  const { certificate } = this.formRef.current.getFieldsValue();
                                  const findItem = certificate.find(item => item.key === field.key);
                                  if (findItem) {
                                    this.setState(prevState => ({
                                      delete_ids: [
                                        ...prevState.delete_ids,
                                        Number.parseInt(findItem.id, 10),
                                      ],
                                    }));
                                  }
                                  remove(field.name);
                                }
                              }}
                            />
                          ) : null}
                        </>
                      </Pane>
                    ))}
                    <Pane className="row">
                      <Pane className="col-lg-3">
                        <ButtonCus
                          color="primary"
                          icon="fe-plus-circle"
                          onClick={() => {
                            add();
                          }}
                        >
                          Thêm dòng
                        </ButtonCus>
                      </Pane>
                    </Pane>
                  </Pane>
                )}
              </Form.List>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                loading={loading || loadingSubmit}
                htmlType="submit"
                icon="fe-save"
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.HISTORY) {
      const { formRef } = this;
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Lịch sử công tác</Heading>
              <Form.List name="history">
                {(fields, { add, remove }) => (
                  <Pane>
                    {fields.map((field, index) => (
                      <Pane className={classnames('row', styles['form-item'])} key={field.key}>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'start_date']}
                            fieldKey={[field.fieldKey, 'start_date']}
                            label={<span>Ngày bắt đầu</span>}
                          >
                            <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'end_date']}
                            fieldKey={[field.fieldKey, 'end_date']}
                            label={<span>Ngày kết thúc</span>}
                            rules={[
                              () => ({
                                validator(rule, value) {
                                  if (value === undefined) {
                                    return Promise.resolve();
                                  }
                                  if (formRef.current) {
                                    const { history } = formRef.current.getFieldsValue();
                                    const dateIndex = history.filter(
                                      (item, indexTime) => indexTime === index,
                                    );
                                    if (!isEmpty(dateIndex)) {
                                      if (
                                        moment(value).diff(dateIndex[0].start_date, 'days', true) >
                                        0
                                      ) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error('Thời gian nhập vào không hợp lệ'),
                                      );
                                    }
                                    return Promise.reject(
                                      new Error('Thời gian nhập vào không hợp lệ'),
                                    );
                                  }
                                  return Promise.reject(
                                    new Error('Thời gian nhập vào không hợp lệ'),
                                  );
                                },
                              }),
                            ]}
                          >
                            <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'company']}
                            fieldKey={[field.fieldKey, 'company']}
                            label={<span>Tên công ty</span>}
                            rules={[
                              variables.RULES.EMPTY_INPUT,
                              variables.RULES.MAX_LENGTH_255,
                            ]}
                          >
                            <Input placeholder="Nhập tên công ty" />
                          </Form.Item>
                        </Pane>
                        <Pane className="col-lg-6">
                          <Form.Item
                            name={[field.name, 'position']}
                            fieldKey={[field.fieldKey, 'position']}
                            label={<span>Chức vụ</span>}
                            rules={[
                              variables.RULES.EMPTY_INPUT,
                              variables.RULES.MAX_LENGTH_255,
                            ]}
                          >
                            <Input placeholder="Nhập chức vụ" />
                          </Form.Item>
                        </Pane>
                        <>
                          {fields?.length > 1 ? (
                            <DeleteOutlined
                              className={styles['icon-delete']}
                              onClick={() => {
                                if (this.formRef.current) {
                                  const { history } = this.formRef.current.getFieldsValue();
                                  const findItem = history.find(item => item.key === field.key);
                                  if (findItem) {
                                    this.setState(prevState => ({
                                      delete_ids: [
                                        ...prevState.delete_ids,
                                        Number.parseInt(findItem.id, 10),
                                      ],
                                    }));
                                  }
                                  remove(field.name);
                                }
                              }}
                            />
                          ) : null}
                        </>
                      </Pane>
                    ))}
                    <Pane className="row">
                      <Pane className="col-lg-3">
                        <ButtonCus
                          color="primary"
                          icon="fe-plus-circle"
                          onClick={() => {
                            add();
                          }}
                        >
                          Thêm dòng
                        </ButtonCus>
                      </Pane>
                    </Pane>
                  </Pane>
                )}
              </Form.List>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                loading={loading || loadingSubmit}
                htmlType="submit"
                icon="fe-save"
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.CONTACT) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin liên hệ</Heading>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item
                    name="current_address"
                    label={<span>Địa chỉ hiện tại</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập địa chỉ hiện tại" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Heading type="form-title" style={{ marginBottom: 20 }}>LIÊN HỆ CHUNG</Heading>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="zalo"
                    label={<span>Zalo</span>}
                    rules={[variables.RULES.NUMBER, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số điện thoại zalo" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="facebook"
                    label={<span>Facebook</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập link facebook" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Heading type="form-title" style={{ marginBottom: 20 }}>LIÊN HỆ KHẨN CẤP</Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="contact_person"
                    label={<span>Người liên hệ</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập tên người liên hệ" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="relationship_with_staff"
                    label={<span>Quan hệ với nhân viên</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập quan hệ" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="emergency_mobile_number"
                    label={<span>Số điện thoại khẩn cấp</span>}
                    rules={[variables.RULES.NUMBER, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số điện thoại khẩn cấp" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Heading type="form-title" style={{ marginBottom: 20 }}>ĐỊA CHỈ THƯỜNG TRÚ</Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="home_town"
                    label={<span>Quê quán</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập quê quán" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="ward"
                    label={<span>Phường (xã, thị trấn)</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập phường (xã, thị trấn)" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="district"
                    label={<span>Quận/Huyện</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập quận,huyện" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="city"
                    label={<span>Tỉnh/Thành phố</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập tỉnh,thành phố" />
                  </Form.Item>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                icon="fe-save"
                htmlType="submit"
                loading={loading || loadingSubmit}
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.HEALTH) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Tình trạng sức khỏe</Heading>
              <Pane className="row">
                <Pane className="col-lg-4">
                  <Form.Item
                    name="height"
                    label={<span>Chiều cao(cm)</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập chiều cao" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="weight"
                    label={<span>Cân nặng</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập cân nặng" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item
                    name="blood_group"
                    label={<span>Nhóm máu</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập nhóm máu" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item
                    name="health_status"
                    label={<span>Tình trạng sức khỏe</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập tình trạng sức khỏe" />
                  </Form.Item>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                icon="fe-save"
                htmlType="submit"
                loading={loadingSubmit || loading}
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.BANK) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin ngân hàng</Heading>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="account_master"
                    label={<span>Chủ tài khoản</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập chủ tài khoản" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="account_number"
                    label={<span>Số tài khoản</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số tài khoản" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="bank_name"
                    label={<span>Ngân hàng</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập ngân hàng" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="bank_branch"
                    label={<span>Chi nhánh</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập chi nhánh" />
                  </Form.Item>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                icon="fe-save"
                htmlType="submit"
                loading={loadingSubmit || loading}
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.RANK) {
      const { visible, details } = this.state;
      const { rankPositionInformations } = this.props;
      return (
        <>
          <Modal
            visible={visible}
            title="Điều chuyển"
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                rank_id: get(details, 'rank.id') || undefined,
                store_id: get(details, 'store.id') || undefined,
                role_id: get(details, 'role.id') || undefined,
                position_id: get(details, 'position.id') || undefined,
                division_id: get(details, 'division.id') || undefined,
                work_form_id: get(details, 'workForm.id') || undefined,
                start_date: details.start_date ? moment(details.start_date) : undefined,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="store_id"
                    label={<span>Chi nhánh</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={category.stores || []} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="division_id"
                    label={<span>Bộ phận</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus
                      placeholder="Chọn"
                      showSearch
                      dataSet={category.divisions || []}
                      onChange={this.onChangeDivisions}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="position_id"
                    label={<span>Chức vụ</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={positions} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="work_form_id"
                    label={<span>Hình thức làm việc</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={category.workForms || []} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="rank_id"
                    label={<span>Cấp bậc</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={category.ranks || []} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="role_id"
                    label={<span>Vai trò</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={category.roles || []} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="start_date"
                    label={<span>Thời gian bắt đầu</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker
                      placeholder="Chọn"
                      format={variables.DATE_FORMAT.DATE}
                      disabledDate={Helper.disabledDate}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Cấp bậc, chức vụ</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(rankPositionInformations) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header(localVariables.TYPE_USER.RANK)}
                    dataSource={rankPositionInformations}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header(localVariables.TYPE_USER.RANK),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                >
                  Điều chuyển
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.TIME_WORK) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Loading loading={loading}>
              <Heading type="form-title" style={{ marginBottom: 20 }}>Thời gian làm việc</Heading>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="start_date"
                    label={<span>Ngày vào làm</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item name="sign_date" label={<span>Ngày ký hợp đồng lao động</span>}>
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                icon="fe-save"
                loading={loading || loadingSubmit}
                htmlType="submit"
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.CONFIG) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Cấu hình chấm công</Heading>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Form.Item name="rank">
                  <Pane>
                    <Switch /> <span>Dùng thẻ từ</span>
                  </Pane>
                </Form.Item>
              </Pane>
              <Pane className="col-lg-6">
                <Form.Item name="rank">
                  <Pane>
                    <Switch /> <span>Cho phép vào ca muộn và ra cao muộn</span>
                  </Pane>
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Form.Item name="rank">
                  <Pane>
                    <Switch /> <span>Dùng vân tay</span>
                  </Pane>
                </Form.Item>
              </Pane>
              <Pane className="col-lg-6">
                <Form.Item name="rank">
                  <Pane>
                    <Switch /> <span>Cho phép chấm công</span>
                  </Pane>
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Form.Item name="rank">
                  <Pane>
                    <Switch /> <span>Cho phép vào ca sớm và ra ca sớm</span>
                  </Pane>
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Form.Item
                  name="rank"
                  label={<span>Mã thẻ nhân viên</span>}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                >
                  <Input placeholder="Nhập mã thẻ" />
                </Form.Item>
              </Pane>
              <Pane className="col-lg-6">
                <Form.Item
                  name="rank"
                  label={<span>Áp dụng máy kiosk tại chi nhánh</span>}
                  rules={[variables.RULES.EMPTY]}
                >
                  <Select allowClear placeholder="Chọn">
                    <Select.Option value="all">Chọn cấp bậc</Select.Option>
                  </Select>
                </Form.Item>
              </Pane>
            </Pane>
            <Pane className="row">
              <Pane className="col-lg-6">
                <Form.Item
                  name="rank"
                  label={<span>Mã vân tay</span>}
                  rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                >
                  <Input placeholder="Nhập mã vân tay" />
                </Form.Item>
              </Pane>
              <Pane className="col-lg-6">
                <Form.Item
                  name="rank"
                  label={<span>Áp dụng máy vân tay tại chi nhánh</span>}
                  rules={[variables.RULES.EMPTY]}
                >
                  <Select allowClear placeholder="Chọn">
                    <Select.Option value="all">Chọn cấp bậc</Select.Option>
                  </Select>
                </Form.Item>
              </Pane>
            </Pane>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus color="green" icon="fe-save">
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.CONTRACT) {
      const { visible, details, files } = this.state;
      const { laboursContracts, dispatch } = this.props;
      const props = {
        beforeUpload: file => {
          const typeSplit = file.name.toLowerCase().split('.');
          const isJpgOrPng =
            typeSplit[typeSplit?.length - 1] === 'docx' ||
            typeSplit[typeSplit?.length - 1] === 'pdf';
          if (!isJpgOrPng) {
            message.error('Định dạng hình ảnh thuộc loại .DOCX,.PDF');
          }
          const isLt2M = file.size / 1024 / 1024 < 5;
          if (!isLt2M) {
            message.error('Dung lượng không được quá 5mb');
          }
          if (isJpgOrPng && isLt2M) {
            dispatch({
              type: 'upload/UPLOAD',
              payload: file,
              callback: response => {
                if (response) {
                  this.setState(prevState => ({
                    files: [
                      ...prevState.files,
                      {
                        path: response.path,
                        file_name: file.name,
                      },
                    ],
                  }));
                }
              },
            });
          }
          return file;
        },
        showUploadList: false,
        fileList: [],
      };
      return (
        <>
          <Modal
            visible={visible}
            title={!isEmpty(details) ? 'SỬA HỢP ĐỒNG LAO ĐỘNG' : 'THÊM HỢP ĐỒNG LAO ĐỘNG'}
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            width={900}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                contract_number: details.contract_number,
                decision_number: details.decision_number,
                labours_contract_category_id:
                  details.labours_contract_category_id && `${details.labours_contract_category_id}`,
                sign_date: details.sign_date ? moment(details.sign_date) : undefined,
                expiration_date: details.expiration_date
                  ? moment(details.expiration_date)
                  : undefined,
                start_date: details.start_date ? moment(details.start_date) : undefined,
                work_adress: details.work_adress,
                work_time: details.work_time,
                work: details.work,
                salary: details.salary,
                payment: details.payment,
                payment_form: details.payment_form,
                position: details.position,
                professional_titles: details.professional_titles,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="contract_number"
                    label={<span>Số hợp đồng</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số hợp đồng" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="labours_contract_category_id"
                    label={<span>Loại hợp đồng</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={category.laboursContracts || []} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="decision_number"
                    label={<span>Số quyết định</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số quyết định" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="sign_date"
                    label={<span>Ngày ký</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item name="start_date" label={<span>Ngày hiệu lực</span>}>
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item name="expiration_date" label={<span>Ngày hết hạn</span>}>
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
              <hr className={common['dot-bottom']} />
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="work"
                    label={<span>Công việc phải làm</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập công việc phải làm" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="work_time"
                    label={<span>Thời gian làm việc</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập thời gian làm việc" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item name="salary" label={<span>Mức lương chính</span>}>
                    <Input placeholder="Nhập mức lương chính" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="payment"
                    label={<span>Hình thức thanh toán</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập hình thức thanh toán" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="payment_form"
                    label={<span>Hình thức trả lương</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập hình thức trả lương" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="professional_titles"
                    label={<span>Đảm nhận vị trí</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập đảm nhận vị trí" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="position"
                    label={<span>Chức danh chuyên môn</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập chức danh chuyên môn" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="insurrance"
                    label={<span>Bảo hiểm xã hội và bảo hiểm y tế </span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <SelectCus
                      placeholder="Chọn"
                      showSearch
                      dataSet={[
                        {
                          id: 'Theo chế độ hiện hành của nhà nước',
                          name: 'Theo chế độ hiện hành của nhà nước',
                        },
                        {
                          id: 'Được tính trong lương',
                          name: 'Được tính trong lương',
                        },
                      ]}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <hr className={common['dot-bottom']} />
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Pane className={common['list-files']}>
                    {files?.map((item, index) => (
                      <Pane className={common.item} key={index}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.file_name}
                          href={`${IMAGE_URL}/${item.path}`}
                          className={common.text}
                        >
                          <PaperClipOutlined className={common.icon} />
                          {item.file_name}
                        </a>
                        <DeleteOutlined
                          className={common['icon-delete']}
                          onClick={() => this.onRemoveFiles(item.path)}
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item label={null} name="files">
                    <Upload {...props}>
                      <ButtonCus color="primary" ghost loading={loadingSubmit}>
                        <UploadOutlined /> Đính kèm file
                      </ButtonCus>
                    </Upload>
                  </Form.Item>
                  <p className="ant-upload-hint">{`(Định dạng .DOCX,.PDF. Dung lượng <5MB)`}</p>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Hợp đồng lao động</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(laboursContracts) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header('contract')}
                    dataSource={laboursContracts}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header('contract'),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                  // isPermisssion
                  action="add"
                  subject="labours-contracts"
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT) {
      const { visible, details, files } = this.state;
      const { minutesOfAgreement, dispatch } = this.props;
      const props = {
        beforeUpload: file => {
          const typeSplit = file.name.toLowerCase().split('.');
          const isJpgOrPng =
            typeSplit[typeSplit?.length - 1] === 'docx' ||
            typeSplit[typeSplit?.length - 1] === 'pdf';
          if (!isJpgOrPng) {
            message.error('Định dạng hình ảnh thuộc loại .DOCX,.PDF');
          }
          const isLt2M = file.size / 1024 / 1024 < 5;
          if (!isLt2M) {
            message.error('Dung lượng không được quá 5mb');
          }
          if (isJpgOrPng && isLt2M) {
            dispatch({
              type: 'upload/UPLOAD',
              payload: file,
              callback: response => {
                if (response) {
                  this.setState(prevState => ({
                    files: [
                      ...prevState.files,
                      {
                        path: response.path,
                        file_name: file.name,
                      },
                    ],
                  }));
                }
              },
            });
          }
          return file;
        },
        showUploadList: false,
        fileList: [],
      };
      return (
        <>
          <Modal
            visible={visible}
            title={!isEmpty(details) ? 'SỬA BIÊN BẢN THỎA THUẬN' : 'THÊM BIÊN BẢN THỎA THUẬN'}
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            width={900}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                contract_number: details.contract_number,
                decision_number: details.decision_number,
                labours_contract_category_id:
                  details.labours_contract_category_id && `${details.labours_contract_category_id}`,
                sign_date: details.sign_date ? moment(details.sign_date) : undefined,
                expiration_date: details.expiration_date
                  ? moment(details.expiration_date)
                  : undefined,
                time_start_probation: details.time_start_probation
                  ? moment(details.time_start_probation)
                  : undefined,
                time_end_probation: details.time_end_probation
                  ? moment(details.time_end_probation)
                  : undefined,
                start_date: details.start_date ? moment(details.start_date) : undefined,
                work_adress: details.work_adress,
                work_time: details.work_time,
                work: details.work,
                salary: details.salary,
                payment: details.payment,
                payment_form: details.payment_form,
                position: details.position,
                professional_titles: details.professional_titles,
                percent_enjoyed: details.percent_enjoyed,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="labours_contract_category_id"
                    label={<span>Loại hợp đồng</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus
                      placeholder="Chọn"
                      showSearch
                      dataSet={[
                        {
                          id: 'Thử việc',
                          name: 'Thử việc',
                        },
                        {
                          id: 'Thời vụ',
                          name: 'Thời vụ',
                        },
                        {
                          id: 'Xác định thời hạn',
                          name: 'Xác định thời hạn',
                        },
                        {
                          id: 'Không xác định thời hạn',
                          name: 'Không xác định thời hạn',
                        },
                      ]}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="decision_number"
                    label={<span>Số quyết định</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số quyết định" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="sign_date"
                    label={<span>Ngày ký</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item name="start_date" label={<span>Ngày hiệu lực</span>}>
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item name="expiration_date" label={<span>Ngày hết hạn</span>}>
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
              <hr className={common['dot-bottom']} />
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="time_start_probation"
                    label={<span>Thời gian bắt đầu thử việc</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="time_end_probation"
                    label={<span>Thời gian kết thúc thử việc</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="work"
                    label={<span>Công việc phải làm</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập công việc phải làm" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="work_time"
                    label={<span>Thời gian làm việc</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập thời gian làm việc" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="work_adress"
                    label={<span>Địa chỉ làm việc</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập địa chỉ làm việc" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item name="salary" label={<span>Mức lương chính</span>}>
                    <Input placeholder="Nhập mức lương chính" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="payment_form"
                    label={<span>Hình thức trả lương</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập hình thức trả lương" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="payment"
                    label={<span>Hình thức thanh toán</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <SelectCus
                      placeholder="Chọn"
                      showSearch
                      dataSet={[
                        {
                          id: '2 lần vào ngày 12 và ngày 22 hàng tháng',
                          name: '2 lần vào ngày 12 và ngày 22 hàng tháng',
                        },
                        {
                          id: '2 lần vào ngày 15 và ngày 25 hàng tháng',
                          name: '2 lần vào ngày 15 và ngày 25 hàng tháng',
                        },
                      ]}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="professional_titles"
                    label={<span>Đảm nhận vị trí</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập đảm nhận vị trí" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="percent_enjoyed"
                    label={<span>Phần trăm được hưởng</span>}
                    rules={[variables.RULES.MAX_LENGTH_255]}
                  >
                    <SelectCus
                      placeholder="Chọn"
                      showSearch
                      dataSet={[
                        {
                          id: '80% mức lương cơ bản',
                          name: '80% mức lương cơ bản',
                        },
                        {
                          id: '100% mức lương cơ bản đối với cá nhân đã có kinh nghiệm làm việc',
                          name: '100% mức lương cơ bản đối với cá nhân đã có kinh nghiệm làm việc',
                        },
                      ]}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <hr className={common['dot-bottom']} />
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Pane className={common['list-files']}>
                    {files?.map((item, index) => (
                      <Pane className={common.item} key={index}>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.file_name}
                          href={`${IMAGE_URL}/${item.path}`}
                          className={common.text}
                        >
                          <PaperClipOutlined className={common.icon} />
                          {item.file_name}
                        </a>
                        <DeleteOutlined
                          className={common['icon-delete']}
                          onClick={() => this.onRemoveFiles(item.path)}
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item label={null} name="files">
                    <Upload {...props}>
                      <ButtonCus color="primary" ghost loading={loadingSubmit}>
                        <UploadOutlined /> Đính kèm file
                      </ButtonCus>
                    </Upload>
                  </Form.Item>
                  <p className="ant-upload-hint">{`(Định dạng .DOCX,.PDF. Dung lượng <5MB)`}</p>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Biên bản thỏa thuận</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(minutesOfAgreement) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header(localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT)}
                    dataSource={minutesOfAgreement}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header(localVariables.TYPE_USER.MINUTEST_OF_AGREEMENT),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                  // isPermisssion
                  action="add"
                  subject="labours-contracts"
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.INSURRANCE) {
      const { visible, details } = this.state;
      const { insurrances } = this.props;
      return (
        <>
          <Modal
            visible={visible}
            title={!isEmpty(details) ? 'SỬA BẢO HIỂM XÃ HỘI' : 'THÊM BẢO HIỂM XÃ HỘI'}
            onOk={this.handleOk}
            centered
            width={900}
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                insurrance_number: details.insurrance_number,
                insurance_salary: details.insurance_salary,
                money_allowance: details.money_allowance,
                time_stop: details.time_stop ? moment(details.time_stop) : undefined,
                time_join: details.time_join ? moment(details.time_join) : undefined,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="insurrance_number"
                    label={<span>Số sổ BHXH</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số hợp đồng" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="insurance_salary"
                    label={<span>Mức lương đóng BHXH</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <InputNumber
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      placeholder="Nhập mức lương (đ)"
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="money_allowance"
                    label={<span>Phụ cấp tiền</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <InputNumber
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      placeholder="Nhập phụ cấp (đ)"
                    />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item name="note" label={<span>Ghi chú</span>}>
                    <SelectCus placeholder="Chọn" dataSet={description} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="time_join"
                    label={<span>Thời gian tham gia</span>}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || !getFieldValue('time_stop')) {
                            return Promise.resolve();
                          }
                          if (
                            moment(value).diff(moment(getFieldValue('time_stop')), 'days', true) <=
                            '0'
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian nhập vào không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="time_stop"
                    label={<span>Thời gian ngừng đóng</span>}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || !getFieldValue('time_join')) {
                            return Promise.resolve();
                          }
                          if (
                            moment(value).diff(moment(getFieldValue('time_join')), 'days', true) >=
                            '0'
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian nhập vào không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Bảo hiểm xã hội</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(insurrances) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header('insurrance')}
                    dataSource={insurrances}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header('insurrance'),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                  // isPermisssion
                  action="add"
                  subject="insurrances"
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.INSURRANCEHEALTH) {
      const { visible, details } = this.state;
      const { healthInsurrances } = this.props;
      return (
        <>
          <Modal
            visible={visible}
            title={!isEmpty(details) ? 'SỬA BẢO HIỂM SỨC KHỎE' : 'THÊM BẢO HIỂM SỨC KHỎE'}
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                insurrance_number: details.insurrance_number || undefined,
                beneficiary_id: get(details, 'beneficiary.id') || undefined,
                start_time: details.start_time ? moment(details.start_time) : undefined,
                end_time: details.end_time ? moment(details.end_time) : undefined,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="insurrance_number"
                    label={<span>Số BH</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập số hợp đồng" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="beneficiary_id"
                    label={<span>Người thụ hưởng</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <SelectCus placeholder="Chọn" showSearch dataSet={category.beneficiaries || []} />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="start_time"
                    label={<span>Ngày bắt đầu</span>}
                    rules={[
                      variables.RULES.EMPTY,
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || !getFieldValue('end_time')) {
                            return Promise.resolve();
                          }
                          if (
                            moment(value).diff(moment(getFieldValue('end_time')), 'days', true) <=
                            '0'
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian nhập vào không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="end_time"
                    label={<span>Ngày kết thúc</span>}
                    rules={[
                      variables.RULES.EMPTY,
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('start_time')) {
                            return Promise.resolve();
                          }
                          if (
                            moment(value).diff(moment(getFieldValue('start_time')), 'days', true) >=
                            '0'
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian nhập vào không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Bảo hiểm sức khỏe</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(healthInsurrances) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header(localVariables.TYPE_USER.INSURRANCEHEALTH)}
                    dataSource={healthInsurrances}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header(localVariables.TYPE_USER.INSURRANCEHEALTH),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                  // isPermisssion
                  action="add"
                  subject="insurrances"
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.DAYS_OFF) {
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Số ngày nghỉ phép</Heading>
            <Loading loading={loading}>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="annual_leave"
                    label={<span>Số ngày nghỉ phép năm</span>}
                    rules={[
                      variables.RULES.EMPTY_INPUT,
                      variables.RULES.NUMBER,
                      variables.RULES.MAX_LENGTH_255,
                    ]}
                  >
                    <Input placeholder="Nhập số ngày" />
                  </Form.Item>
                </Pane>
              </Pane>
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              <ButtonCus
                color="green"
                htmlType="submit"
                icon="fe-save"
                loading={loadingSubmit || loading}
              >
                Cập nhật
              </ButtonCus>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.SALARY) {
      const { visible, details } = this.state;
      const { salaryInformations } = this.props;
      return (
        <>
          <Modal
            visible={visible}
            title="THÊM MỨC LƯƠNG"
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                payments: details.payments || undefined,
                status: details.status || undefined,
                time_application: details.time_application
                  ? moment(details.time_application)
                  : undefined,
                wage: details.wage ? `${details.wage}` : undefined,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="time_application"
                    label={<span>Thời gian áp dụng</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="wage"
                    label={<span>Mức lương (đ)</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <InputNumber
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      placeholder="Nhập mức lương (đ)"
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item name="payments" label={<span>Hình thức chi trả</span>}>
                    <Select allowClear={false} placeholder="Chọn">
                      {localVariables.LIST_PAYMENTS.map(item => (
                        <Select.Option value={item.value} key={item.value}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="status"
                    label={<span>Trạng thái</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <Select allowClear={false} placeholder="Chọn">
                      {localVariables.LIST_STATUS_PAYMENTS.map(item => (
                        <Select.Option value={item.value} key={item.value}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin mức lương</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(salaryInformations) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header(localVariables.TYPE_USER.SALARY)}
                    dataSource={salaryInformations}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header(localVariables.TYPE_USER.SALARY),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  // isPermisssion
                  action="add"
                  subject="children"
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.CHILDREN) {
      const { visible, details } = this.state;
      const { children } = this.props;
      return (
        <>
          <Modal
            visible={visible}
            title={!isEmpty(details) ? 'SỬA THÔNG TIN CON' : 'THÊM THÔNG TIN CON'}
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                full_name: details.full_name,
                gender: details.gender,
                birthday: details.birthday ? moment(details.birthday) : undefined,
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="full_name"
                    label={<span>Họ tên con</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập họ tên con" />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item name="gender" label={<span>Giới tính</span>}>
                    <Select allowClear placeholder="Chọn">
                      <Select.Option value="NAM">Nam</Select.Option>
                      <Select.Option value="NU">Nữ</Select.Option>
                    </Select>
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="birthday"
                    label={<span>Ngày sinh</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Thông tin con</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(children) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header('children')}
                    dataSource={children}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header('children'),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.REWARD) {
      const props = {
        beforeUpload: file => {
          const typeSplit = file.name.toLowerCase().split('.');
          const isDocOrPdf =
            typeSplit[typeSplit?.length - 1] === 'docx' ||
            typeSplit[typeSplit?.length - 1] === 'doc' ||
            typeSplit[typeSplit?.length - 1] === 'pdf';
          if (!isDocOrPdf) {
            message.error('Định dạng văn bản thuộc loại .DOC, .DOCX, .PDF');
          }
          const isLt2M = file.size / 1024 / 1024 < 5;
          if (!isLt2M) {
            message.error('Dung lượng văn bản nhỏ hơn 5MB');
          }
          if (isDocOrPdf && isLt2M) {
            const { dispatch } = this.props;
            dispatch({
              type: 'upload/UPLOAD',
              payload: file,
              callback: response => {
                if (response) {
                  this.setState(prevState => ({
                    files: [
                      ...prevState.files,
                      {
                        path: response.path,
                        file_name: file.name,
                      },
                    ],
                  }));
                }
              },
            });
          }
          return file;
        },
        showUploadList: false,
        fileList: [],
      };
      const { visible, details, files } = this.state;
      const { reward } = this.props;
      return (
        <>
          <Modal
            visible={visible}
            title={!isEmpty(details) ? 'SỬA THƯỞNG CÁ NHÂN' : 'THÊM THƯỞNG CÁ NHÂN'}
            onOk={this.handleOk}
            centered
            onCancel={this.cancelModal}
            footer={
              <Pane className="text-center">
                <ButtonCus key="cancel" color="white" icon="fe-x" onClick={this.cancelModal}>
                  Hủy
                </ButtonCus>
                <ButtonCus
                  key="choose"
                  color="primary"
                  icon="fe-save"
                  onClick={this.onSave}
                  loading={loadingSubmit}
                >
                  Lưu
                </ButtonCus>
              </Pane>
            }
          >
            <Form
              layout="vertical"
              ref={this.formRefModal}
              initialValues={{
                date: details.date ? moment(details.date) : undefined,
                bonus: details.bonus || undefined,
                reason: details.reason || '',
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Form.Item
                    name="date"
                    label={<span>Ngày thưởng</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <DatePicker placeholder="Chọn" format={variables.DATE_FORMAT.DATE} />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-6">
                  <Form.Item
                    name="bonus"
                    label={<span>Mức thưởng (đ)</span>}
                    rules={[variables.RULES.EMPTY]}
                  >
                    <InputNumber
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                      placeholder="Nhập mức thưởng (đ)"
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item
                    name="reason"
                    label={<span>Lý do</span>}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_255]}
                  >
                    <Input placeholder="Nhập lý do" />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row mb-3">
                <Pane className="col-lg-12">
                  <p className={common['title-search-norm']}>Hình ảnh</p>
                  <Pane className="row">
                    {files?.map((item, index) => (
                      <Pane className="col-lg-12 mt-2 mb-2" key={index}>
                        <Link to={{ pathname: `${IMAGE_URL}/${item.path}` }} target="_blank">
                          {item.file_name}
                        </Link>
                        <DeleteOutlined
                          className="float-right"
                          onClick={() => this.onRemoveFiles(item.path)}
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item label={null} name="files">
                    <Upload {...props}>
                      <ButtonCus color="primary" ghost loading={loadingSubmit}>
                        <UploadOutlined /> Đính kèm file
                      </ButtonCus>
                    </Upload>
                  </Form.Item>
                  <p className="ant-upload-hint">{`(Định dạng .DOC, .DOCX, .PDF. Dung lượng <5MB)`}</p>
                </Pane>
              </Pane>
            </Form>
          </Modal>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Thưởng cá nhân</Heading>
            <Pane className="row">
              <Pane className="col-lg-12">
                {!isEmpty(reward) && (
                  <Table
                    className="utils__scrollTable"
                    columns={this.header('reward')}
                    dataSource={reward}
                    loading={false}
                    pagination={false}
                    params={{
                      header: this.header('reward'),
                      type: 'table',
                    }}
                    rowKey={(record, index) => index}
                    scroll={{ x: true, y: 600 }}
                  />
                )}
              </Pane>
            </Pane>
            <Pane className="row mt-3">
              <Pane className="col-lg-12">
                <ButtonCus
                  color="primary"
                  icon="fe-plus"
                  onClick={this.handleOk}
                  loading={loadingSubmit}
                  // isPermisssion
                  action="add"
                  subject="reward"
                >
                  Thêm mới
                </ButtonCus>
              </Pane>
            </Pane>
          </Pane>
        </>
      );
    }
    if (type === localVariables.TYPE_USER.MAGNETIC_CARDS) {
      const { magneticCards } = this.props;
      return (
        <>
          <Pane className="card pt-4 pb-4 pr-4 pl-4">
            <Heading type="form-title" style={{ marginBottom: 20 }}>Thẻ từ</Heading>
            <Loading loading={loading}>
              <Pane className="row">
                <Pane className="col-lg-12">
                  <Form.Item
                    name="card"
                    label={<span>Mã thẻ</span>}
                    rules={[
                      variables.RULES.EMPTY_INPUT,
                      variables.RULES.NUMBER,
                      variables.RULES.MAX50,
                    ]}
                  >
                    <Input placeholder="Nhập mã thẻ" />
                  </Form.Item>
                </Pane>
              </Pane>
              {!isEmpty(magneticCards) && (
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <Form.Item name="status" label={<span>Trạng thái Kiosk</span>}>
                      <div className={common['table-switch']}>
                        <Switch
                          checked={magneticCards[0].status === variables.STATUS.ON}
                          onChange={event => this.onChangeCheck(magneticCards[0], event)}
                        />
                        <span>
                          {magneticCards[0].status === variables.STATUS.ON
                            ? 'Đang mở'
                            : 'Đang khóa'}
                        </span>
                      </div>
                    </Form.Item>
                  </Pane>
                  <Pane className="col-lg-12">
                    <Form.Item name="status" label={<span>Trạng thái Chấm công</span>}>
                      <div className={common['table-switch']}>
                        <Switch
                          checked={magneticCards[0].timekeeping_status === variables.STATUS.ON}
                          onChange={event => this.onChangeCheckTimeKeeping(magneticCards[0], event)}
                        />
                        <span>
                          {magneticCards[0].timekeeping_status === variables.STATUS.ON
                            ? 'Đang mở'
                            : 'Đang khóa'}
                        </span>
                      </div>
                    </Form.Item>
                  </Pane>
                </Pane>
              )}
            </Loading>
          </Pane>
          <Pane className="row">
            <Pane className="col-lg-12 text-center">
              {isEmpty(magneticCards) && (
                <ButtonCus
                  color="green"
                  htmlType="submit"
                  icon="fe-save"
                  loading={loadingSubmit || loading}
                >
                  Cập nhật
                </ButtonCus>
              )}
            </Pane>
          </Pane>
        </>
      );
    }
    return '';
  };

  onCheckMenuEdit = data => {
    const {
      match: { params },
    } = this.props;
    // if (!get(params, 'id')) {
    //   return data.filter(item => item.type === localVariables.TYPE_USER.INFO);
    // }
    return data;
  };

  render() {
    const {
      error,
      dataMenu,
      detailsInfo,
      location: {
        query: { type },
      },
      match: { params },
      loading: { effects },
    } = this.props;
    const loading = effects['userAdd/GET_MENU'];
    return (
      <Authorized
        redirect
        roles={[]}
        to="/ho-so-doi-tuong/nhan-vien"
      >
        <Loading isError={error.isError} params={{ error }}>
          <Helmet title="Nhân viên" />
          <Pane style={{ padding: 20 }}>
            <Pane className="row mb-3">
              <Pane className="col-lg-6">
                {!get(params, 'id') && <Heading type="page-title">TẠO MỚI NHÂN VIÊN</Heading>}
                {get(params, 'id') && (
                  <>
                    <Heading type="page-title">
                      {get(detailsInfo, 'full_name')} &nbsp;&nbsp;&nbsp;
                    </Heading>
                  </>
                )}
              </Pane>
              <Pane className="col-lg-6 text-right">
                {get(params, 'id') && (
                  <ButtonCus
                    color="primary"
                    icon="fe-save"
                    onClick={this.onStorage}
                    // isPermisssion
                    action="update"
                    subject="users.storage"
                  >
                    Lưu trữ
                  </ButtonCus>
                )}
              </Pane>
            </Pane>
            <Pane className="row">
              <Pane className="col-lg-3">
                <Pane className="card">
                  <Loading loading={loading}>
                    <Menu
                      defaultSelectedKeys={type}
                      mode="inline"
                      // className={styles['menu-permission']}
                    >
                      {this.onCheckMenuEdit(dataMenu).map(item => (
                        <Menu.Item key={item.type}>
                          <Link
                            className={styles.link}
                            to={`/ho-so-doi-tuong/nhan-vien/${get(params, 'id') || 'tao-moi'}?type=${item.type}`}
                          >
                            {item.name}
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu>
                  </Loading>
                </Pane>
              </Pane>
              <Pane className="col-lg-9">
                <Form
                  initialValues={{
                    certificate: [{}],
                    level: [
                      {
                        key: 0,
                        level: undefined,
                        specialization: undefined,
                        date_of_issue: undefined,
                        training_place: undefined,
                      },
                    ],
                    history: [{}],
                    children: [{}],
                  }}
                  layout="vertical"
                  onFinish={this.onFinish}
                  ref={this.formRef}
                >
                  {this.renderContentForm(type)}
                </Form>
              </Pane>
            </Pane>
          </Pane>
        </Loading>
      </Authorized>
    );
  }
}
Index.propTypes = {
  loading: PropTypes.any,
  dispatch: PropTypes.any,
  match: PropTypes.any.isRequired,
  location: PropTypes.any.isRequired,
  error: PropTypes.objectOf(PropTypes.any),
  reward: PropTypes.arrayOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.arrayOf(PropTypes.any),
  dataMenu: PropTypes.arrayOf(PropTypes.any),
  category: PropTypes.objectOf(PropTypes.any),
  insurrances: PropTypes.arrayOf(PropTypes.any),
  detailsInfo: PropTypes.objectOf(PropTypes.any),
  magneticCards: PropTypes.arrayOf(PropTypes.any),
  detailEducations: PropTypes.arrayOf(PropTypes.any),
  detailsWorkTimes: PropTypes.arrayOf(PropTypes.any),
  laboursContracts: PropTypes.arrayOf(PropTypes.any),
  healthInsurrances: PropTypes.arrayOf(PropTypes.any),
  detailsWorkHistory: PropTypes.arrayOf(PropTypes.any),
  salaryInformations: PropTypes.arrayOf(PropTypes.any),
  detailsAbbaticalLeaves: PropTypes.arrayOf(PropTypes.any),
  detailsBankInformations: PropTypes.arrayOf(PropTypes.any),
  detailsHealthInfomations: PropTypes.arrayOf(PropTypes.any),
  rankPositionInformations: PropTypes.arrayOf(PropTypes.any),
  detailsContactInformation: PropTypes.arrayOf(PropTypes.any),
  minutesOfAgreement: PropTypes.arrayOf(PropTypes.any),
};
Index.defaultProps = {
  error: {},
  reward: [],
  details: {},
  dispatch: {},
  category: {},
  children: [],
  dataMenu: [],
  loading: false,
  detailsInfo: {},
  insurrances: [],
  magneticCards: [],
  detailEducations: [],
  detailsWorkTimes: [],
  laboursContracts: [],
  healthInsurrances: [],
  detailsWorkHistory: [],
  salaryInformations: [],
  detailsAbbaticalLeaves: [],
  detailsBankInformations: [],
  detailsHealthInfomations: [],
  rankPositionInformations: [],
  detailsContactInformation: [],
  minutesOfAgreement: [],
};

export default Index;

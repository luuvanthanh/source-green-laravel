import { memo, useRef, useEffect } from 'react';
import { Avatar, Image } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import csx from 'classnames';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Text from '@/components/CommonComponent/Text';
import { Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';
import { UserOutlined } from '@ant-design/icons';
import stylesModule from '../styles.module.scss';

const marginProps = { style: { paddingTop: 12, paddingBottom: 20 } };

const mapStateToProps = ({ loading, HRMReportHistoryEmployee, menu }) => ({
    loading,
    details: HRMReportHistoryEmployee.details,
    error: HRMReportHistoryEmployee.error,
    menuData: menu.menuLeftHRM,
});
const General = memo(
    ({ dispatch, match: { params }, details, error, menuData }) => {
        const mounted = useRef(false);

        useEffect(() => {
            if (params.id) {
                dispatch({
                    type: 'HRMReportHistoryEmployee/GET_DETAILS',
                    payload: { employeeId: params.id },
                });
            }
        }, [params.id]);
        /**
         * Function submit form modal
         * @param {object} values values of form
         */

        useEffect(() => {
            mounted.current = true;
            return mounted.current;
        }, []);


        const header = () => {
            const columns = [
                {
                    title: 'Số quyết định',
                    key: 'decisionNumber',
                    className: 'min-width-150',
                    width: 150,
                    render: (record) => record.decisionNumber,
                },
                {
                    title: 'Ngày',
                    key: 'timeApply',
                    className: 'min-width-150',
                    width: 150,
                    render: (record) => record.timeApply,
                },
                {
                    title: 'Nội dung',
                    key: 'reason',
                    className: 'min-width-200',
                    render: (record) => record.reason,
                },
            ];
            return columns;
        };

        const headerAppoint = () => {
            const columns = [
                {
                    title: 'Số quyết định',
                    key: 'decisionNumber',
                    className: 'min-width-150',
                    width: 150,
                    render: (record) => record.decisionNumber,
                },
                {
                    title: 'Ngày',
                    key: 'timeApply',
                    className: 'min-width-150',
                    width: 150,
                    render: (record) => record.timeApply,
                },
                {
                    title: 'Chức vụ',
                    key: 'position',
                    className: 'min-width-200',
                    render: (record) => record.position,
                },
            ];
            return columns;
        };

        return (
            <>
                <Helmet title="Tạo hồ sơ nhân viên" />
                <Breadcrumbs last="Chi tiết" menu={menuData} />
                <div style={{ padding: 20, paddingTop: 0 }}>
                    <div className="row" style={{ marginBottom: 20 }}>
                        {params.id && (
                            <div className="col">
                                <Heading type="page-title">Chi tiết lịch sử nhân sự</Heading>
                            </div>
                        )}
                    </div>
                    <Pane className="card">
                        <Loading isError={error.isError} params={{ error }}>
                            <Pane style={{ padding: 20, paddingTop: 0 }} className="pb-0">

                                <div className="row" {...marginProps} style={{ padding: 20 }} >

                                    {Helper.isJSON(details?.fileImage) &&
                                        JSON.parse(details?.fileImage)?.length > 0 ?
                                        JSON.parse(details?.fileImage).map((item) => (
                                            <Image
                                                style={{ borderRadius: 2, marginRight: 20, objectFit: "contain", margin: 0 }}
                                                width={102}
                                                height={102}
                                                src={`${API_UPLOAD}${item}`}
                                            />
                                        ))
                                        :
                                        < Avatar shape="square" size={100} icon={<UserOutlined />} />
                                    }
                                    <Text size="normal" className={stylesModule['general-fullName']}>
                                        {details?.fullName}
                                    </Text>

                                </div>
                                <div className="row border-top" {...marginProps}>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Cơ sở</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.branch}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Bộ phận</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.division}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Chức vụ</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.position}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Ngày sinh</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.dateOfBirth}
                                        </Text>
                                    </div>
                                </div>

                                <div className="row border-top" {...marginProps}>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Giới tính</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.gender}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Số điện thoại</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.phoneNumber}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Địa chỉ</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.address}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Số sổ bảo hiểm</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.numberSocialInsurance}
                                        </Text>
                                    </div>
                                </div>

                                <div className="row border-top" {...marginProps}>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Ngày bắt đầu làm việc</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.startDateWorking}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Ngày hiện tại</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.dateNow}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Số tháng làm việc</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.numberMonthWorking}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Số hợp đồng lao động</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.numberLabourContract}
                                        </Text>
                                    </div>
                                </div>

                                <div className="row border-top" {...marginProps}>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">Ngày ký</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.contractDate}
                                        </Text>
                                    </div>
                                    <div className="col-lg-3">
                                        <div className="ant-col ant-form-item-label">
                                            <label className="ant-form-item-required">HĐ/năm</label>
                                        </div>
                                        <Text size="normal" className={stylesModule['general-detail']}>
                                            {details?.typeOfContract}
                                        </Text>
                                    </div>
                                </div>


                            </Pane>
                        </Loading>
                    </Pane>

                    <Pane className="card pl20 pt20 pr20">
                        <Pane className="pb-0 row">
                            <div className="col-lg-12">
                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                    Thông tin ngày phép
                                </Heading>
                            </div>
                            <div className={csx(stylesModule['item-leave-day'], 'col-lg-3')}>
                                <h3 className={stylesModule.title} >Số ngày phép</h3>
                                <h2 className={stylesModule.number} style={{ color: '#27a600' }}>0</h2>
                            </div>
                            <div className={csx(stylesModule['item-leave-day'], 'col-lg-3')}>
                                <h3 className={stylesModule.title}>Số ngày nghỉ có phép</h3>
                                <h2 className={stylesModule.number} style={{ color: '#3B5CAD' }}>0</h2>
                            </div>
                            <div className={csx(stylesModule['item-leave-day'], 'col-lg-3')}>
                                <h3 className={stylesModule.title}>Số ngày không phép</h3>
                                <h2 className={stylesModule.number} style={{ color: '#FF8300' }}>0</h2>
                            </div>
                            <div className={csx(stylesModule['item-leave-day'], 'col-lg-3')}>
                                <h3 className={stylesModule.title}>Còn lại</h3>
                                <h2 className={stylesModule.number} style={{ color: ' #36383A' }}>0</h2>
                            </div>

                        </Pane>
                    </Pane>

                    <Pane className="row">
                        <div className="col-lg-6">
                            <Pane className="card p20">
                                <div className="col-lg-12 p0">
                                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        Quyết định bổ nhiệm
                                    </Heading>
                                </div>
                                <div className={stylesModule['wrapper-table-items']}>
                                    <Table
                                        columns={headerAppoint()}
                                        dataSource={details.appoint}
                                        bordered={false}
                                        pagination={false}
                                        rowKey={(record) => record.id}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            </Pane>
                        </div>
                        <div className="col-lg-6">
                            <Pane className="card p20">
                                <div className="col-lg-12 p0">
                                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        Quyết định điều chuyển
                                    </Heading>
                                </div>
                                <div className={stylesModule['wrapper-table-items']}>
                                    <Table
                                        columns={header()}
                                        dataSource={details.transfer}
                                        bordered={false}
                                        pagination={false}
                                        rowKey={(record) => record.id}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            </Pane>
                        </div>
                        <div className="col-lg-6">
                            <Pane className="card p20">
                                <div className="col-lg-12 p0">
                                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        Quyết định khen thưởng/kỷ luật
                                    </Heading>
                                </div>
                                <div className={stylesModule['wrapper-table-items']}>
                                    <Table
                                        columns={header()}
                                        dataSource={details.decisionReward}
                                        bordered={false}
                                        pagination={false}
                                        rowKey={(record) => record.id}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            </Pane>
                        </div>
                        <div className="col-lg-6">
                            <Pane className="card p20">
                                <div className="col-lg-12 p0">
                                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        Quyết định tăng lương
                                    </Heading>
                                </div>
                                <div className={stylesModule['wrapper-table-items']}>
                                    <Table
                                        columns={header()}
                                        dataSource={details.salaryIncrease}
                                        className="table-normal"
                                        bordered={false}
                                        pagination={false}
                                        rowKey={(record) => record.id}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            </Pane>
                        </div>
                        <div className="col-lg-6">
                            <Pane className="card p20">
                                <div className="col-lg-12 p0">
                                    <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        Quyết định thôi việc
                                    </Heading>
                                </div>
                                <div className={stylesModule['wrapper-table-items']}>
                                    <Table
                                        columns={header()}
                                        dataSource={details.resignationDecision}
                                        bordered={false}
                                        pagination={false}
                                        rowKey={(record) => record.id}
                                        scroll={{ x: '100%' }}
                                    />
                                </div>
                            </Pane>
                        </div>

                    </Pane>
                </div>
            </>
        );
    },
);

General.propTypes = {
    dispatch: PropTypes.func,
    match: PropTypes.objectOf(PropTypes.any),
    details: PropTypes.objectOf(PropTypes.any),
    loading: PropTypes.objectOf(PropTypes.any),
    error: PropTypes.objectOf(PropTypes.any),
    branches: PropTypes.arrayOf(PropTypes.any),
    classes: PropTypes.arrayOf(PropTypes.any),
    menuData: PropTypes.arrayOf(PropTypes.any),
    city: PropTypes.arrayOf(PropTypes.any),
    district: PropTypes.arrayOf(PropTypes.any),
    search: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
    match: {},
    details: {},
    dispatch: () => { },
    loading: {},
    error: {},
    branches: [],
    classes: [],
    menuData: [],
    city: [],
    district: [],
    search: [],
};

export default withRouter(connect(mapStateToProps)(General));

import { memo } from 'react';
// import PropTypes from 'prop-types';
import TableCus from '@/components/CommonComponent/Table';

const Index = memo(() => {
    const header = () => {
        const columns = [
            {
                title: 'STT ',
                key: 'index',
                width: 80,
            },
            {
                title: 'Thời gian',
                key: 'created_at',
                className: 'min-width-150',
                width: 150,
                render: (record) => record?.created_at,
                fixed: 'left',
            },
            {
                title: 'Trạng thái',
                className: 'min-width-250',
                key: 'status',
            },
            {
                title: 'Họ và tên',
                key: 'name',
                className: 'min-width-150',
                width: 150,
                render: (record) => record?.name,
            },
            {
                title: 'Số điện thoại',
                key: 'phone',
                className: 'min-width-150',
                width: 150,
            },
            {
                title: 'Email',
                key: 'email',
                className: 'min-width-150',
                width: 150,
            },
        ];
        return columns;
    };
    return (
        <>
            <TableCus
                className="content-vertical-top mb20"
                columns={header}
                loading={false}
                error={{}}
                isError={false}
                pagination={false}
                rowKey="id"
                scroll={{ x: '100%' }}
            />
        </>
    );
});

Index.propTypes = {
   
};

Index.defaultProps = {
   
};

export default Index;
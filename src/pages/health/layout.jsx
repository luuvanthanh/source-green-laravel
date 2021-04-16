import { memo } from 'react'
import { Layout } from 'antd'
import { useSelector } from 'dva'
import ptx from 'prop-types'
import csx from 'classnames'

import Pane from '@/components/CommonComponent/Pane'

import styles from '@/assets/styles/Common/common.scss'

const { Content } = Layout

const Index = memo(({ children = null }) => {
  const { isMenuCollapsed } = useSelector(({ settings }) => settings)

  return (
    <Content
      className={csx({
        [styles['layout-collapse']]: isMenuCollapsed
      },
        'position-relative',
        'h-100',
      )}
    >
      <Pane className={styles.content}>
        {children}
      </Pane>
    </Content>
  )
})

Index.propTypes = {
  children: ptx.any,
}

export default Index

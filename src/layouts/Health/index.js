import { memo } from 'react'
import { Layout } from 'antd'
import ptx from 'prop-types'
import csx from 'classnames'
import { useSelector } from 'dva'

import Menu from '@/components/LayoutComponents/Menu'
import Settings from '@/components/LayoutComponents/Settings'
import TopBar from '@/components/LayoutComponents/TopBar';

const { Header } = Layout

const MainLayout = memo(({ children = null }) => {
  const {
    isBorderless,
    isSquaredBorders,
    isFixedWidth,
    isMenuShadow,
    isMenuTop,
    menuData,
  } = useSelector(({ settings, menu }) => ({ ...settings, menuData: menu.menuLeftHealth }))

  return (
    <Layout className={csx({
      settings__borderLess: isBorderless,
      settings__squaredBorders: isSquaredBorders,
      settings__fixedWidth: isFixedWidth,
      settings__menuShadow: isMenuShadow,
      settings__menuTop: isMenuTop,
    })}>
      <Menu
        menu={menuData}
        info={{
          icon: '/images/home/tumblr.svg',
          title: 'Sức khỏe',
        }}
      />
      <Settings />
      <Layout>
        <Header>
          <TopBar />
        </Header>
        {children}
      </Layout>
    </Layout>
  )
})

MainLayout.propTypes = {
  children: ptx.any,
}

export default MainLayout;

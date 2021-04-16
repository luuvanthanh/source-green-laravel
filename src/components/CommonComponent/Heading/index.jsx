import { memo } from 'react'
import PropTypes from 'prop-types'
import csx from 'classnames'

import styles from './styles.module.scss'

const Heading = memo(({ type, children, className, ...props }) => (
  <h2 className={csx(styles[type], className)} {...props}>{children}</h2>
))

Heading.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default Heading
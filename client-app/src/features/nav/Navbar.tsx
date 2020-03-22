import React, { FC } from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { NavLink } from 'react-router-dom'

const Navbar: FC = () => {
	return (
		<Menu fixed='top' inverted>
			<Container>
				<Menu.Item header as={NavLink} exact to='/'>
          <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
          Reactivities
        </Menu.Item>
				<Menu.Item name='Activities' as={NavLink} exact to='/activities'/>
				<Menu.Item>
          <Button positive content='Create Activity' as={NavLink} exact to='/create-activity' />
        </Menu.Item>
			</Container>
		</Menu>
	)
}

export default observer(Navbar)

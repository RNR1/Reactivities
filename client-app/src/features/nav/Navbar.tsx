import React, { FC, useContext } from 'react'
import ActivityStore from '../../app/stores/activityStore'
import { Menu, Container, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'



const Navbar: FC = () => {
	const activityStore = useContext(ActivityStore)
	const {openCreateForm} = activityStore
	return (
		<Menu fixed='top' inverted>
			<Container>
				<Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
          Reactivities
        </Menu.Item>
				<Menu.Item name='Activities' />
				<Menu.Item>
          <Button onClick={openCreateForm} positive content='Create Activity' />
        </Menu.Item>
			</Container>
		</Menu>
	)
}

export default observer(Navbar)

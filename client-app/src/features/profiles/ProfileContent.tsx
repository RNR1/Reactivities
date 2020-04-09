import React, { FC } from 'react'
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import ProfileDescription from './ProfileDescription'
import ProfileFollowings from './ProfileFollowings'

const panes = [
	{ menuItem: 'About', render: () => <ProfileDescription /> },
	{ menuItem: 'Photos', render: () => <ProfilePhotos /> },
	{
		menuItem: 'Activities',
		render: () => <Tab.Pane>Activities Content</Tab.Pane>,
	},
	{
		menuItem: 'Followers',
		render: () => <ProfileFollowings />,
	},
	{
		menuItem: 'Following',
		render: () => <ProfileFollowings />,
	},
]

interface IProps {
	setActiveTab: (activeIndex: any) => void
}

const ProfileContent: FC<IProps> = ({ setActiveTab }) => {
	return (
		<div>
			<Tab
				menu={{ fluid: true, vertical: true }}
				menuPosition='right'
				panes={panes}
				onTabChange={(e, data) => setActiveTab(data.activeIndex)}
			/>
		</div>
	)
}

export default ProfileContent

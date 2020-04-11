import React, { FC } from 'react'
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import ProfileDescription from './ProfileDescription'
import ProfileFollowings from './ProfileFollowings'
import ProfileActivities from './ProfileActivities'

const panes = [
	{ menuItem: 'About', render: () => <ProfileDescription /> },
	{ menuItem: 'Photos', render: () => <ProfilePhotos /> },
	{ menuItem: 'Activities', render: () => <ProfileActivities /> },
	{ menuItem: 'Followers', render: () => <ProfileFollowings /> },
	{ menuItem: 'Following', render: () => <ProfileFollowings /> },
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

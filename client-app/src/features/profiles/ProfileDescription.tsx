import React, { useContext, useState } from 'react'
import { Tab, Grid, Header, Button } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite'
import ProfileEditForm from './ProfileEditForm'

const ProfileDescription = () => {
	const rootStore = useContext(RootStoreContext)
	const { profile, isCurrentUser, updateProfile } = rootStore.profileStore
	const [editMode, setEditMode] = useState(false)

	return (
		<Tab.Pane>
			<Grid>
				<Grid.Column width={16} style={{ paddingBottom: 0 }}>
					<Header
						floated='left'
						icon='user'
						content={`About ${profile?.displayName}`}
					/>
					{isCurrentUser && (
						<Button
							floated='right'
							basic
							content={editMode ? 'Cancel' : 'Edit Profile'}
							onClick={() => setEditMode(!editMode)}
						/>
					)}
				</Grid.Column>
				<Grid.Column width={16}>
					{editMode ? (
						<ProfileEditForm onSubmit={updateProfile} profile={profile!} />
					) : (
						<p>{profile?.bio}</p>
					)}
				</Grid.Column>
			</Grid>
		</Tab.Pane>
	)
}

export default observer(ProfileDescription)

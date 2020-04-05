import React, { useContext, useEffect, FC } from 'react'
import { Grid } from 'semantic-ui-react'
import ProfileHeader from './ProfileHeader'
import ProfileContent from './ProfileContent'
import { RootStoreContext } from '../../app/stores/rootStore'
import { RouteComponentProps } from 'react-router-dom'
import { Spinner } from '../../app/layout/Spinner'
import { observer } from 'mobx-react-lite'

interface RouteParams {
	username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

const Profile: FC<IProps> = ({match}) => {
	const rootStore = useContext(RootStoreContext)
	const { loadingProfile, profile, loadProfile } = rootStore.profileStore
  const {username} = match.params

	useEffect(() => {
		loadProfile(username)
  }, [loadProfile, username])
  
  if (loadingProfile) return <Spinner content="Loading profile..." />

	return (
		<Grid>
			<Grid.Column width={16}>
				<ProfileHeader profile={profile!} />
				<ProfileContent />
			</Grid.Column>
		</Grid>
	)
}

export default observer(Profile)

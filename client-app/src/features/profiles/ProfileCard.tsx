import React, { FC } from 'react'
import { Card, Image, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { IProfile } from '../../app/models/profile'
import { observer } from 'mobx-react-lite'

interface IProps {
	profile: IProfile
}

const ProfileCard: FC<IProps> = ({ profile }) => {
	return (
		<Card as={Link} to={`/profile/${profile.username}`}>
			<Image src={profile.image || '/assets/user.png'} />
			<Card.Content>
				<Card.Header>{profile.displayName}</Card.Header>
			</Card.Content>
			<Card.Content extra>
				<div>
					<Icon name='user' />
					{profile.followersCount} Followers
				</div>
			</Card.Content>
		</Card>
	)
}

export default observer(ProfileCard)

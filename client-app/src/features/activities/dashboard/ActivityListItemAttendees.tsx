import React, { FC } from 'react'
import { List, Image, Popup } from 'semantic-ui-react'
import { IAttendee } from '../../../app/models/activity'

interface IProps {
	attendees: IAttendee[]
}

const ActivityListItemAttendees: FC<IProps> = ({ attendees }) => {
	return (
		<List horizontal>
			{attendees.map(a => (
				<List.Item key={a.username}>
					<Popup
						header={a.displayName}
						trigger={
							<Image size='mini' circular src={a.image || '/assets/user.png'} />
						}
					/>
				</List.Item>
			))}
		</List>
	)
}

export default ActivityListItemAttendees

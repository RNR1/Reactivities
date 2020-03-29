import React, { Fragment, FC } from 'react'
import { Segment, List, Item, Label, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { IAttendee } from '../../../app/models/activity'
import { observer } from 'mobx-react-lite'

interface IProps {
	attendees: IAttendee[]
}

const ActivityDetailedSidebar: FC<IProps> = ({ attendees }) => {
	return (
		<Fragment>
			<Segment
				textAlign='center'
				style={{ border: 'none' }}
				attached='top'
				secondary
				inverted
				color='teal'>
				{attendees.length} {attendees.length === 1 ? 'Person' : 'People'} Going
			</Segment>
			<Segment attached>
				<List relaxed divided>
					{attendees.map(a => (
						<Item key={a.username} style={{ position: 'relative' }}>
							{a.isHost && (
								<Label
									style={{ position: 'absolute' }}
									color='orange'
									ribbon='right'>
									Host
								</Label>
							)}
							<Image size='tiny' src={a.image || '/assets/user.png'} />
							<Item.Content verticalAlign='middle'>
								<Item.Header as='h3'>
									<Link to={`/profile/${a.username}`}>{a.displayName}</Link>
								</Item.Header>
								<Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
							</Item.Content>
						</Item>
					))}
				</List>
			</Segment>
		</Fragment>
	)
}

export default observer(ActivityDetailedSidebar)

import React, { FC, useContext, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Spinner } from '../../../app/layout/Spinner'

interface IParams {
	id: string
}

const ActivityDetails: FC<RouteComponentProps<IParams>> = props => {
	const activityStore = useContext(ActivityStore)
	const { activity, loadActivity } = activityStore
	const { id } = props.match.params
	const { history } = props

	useEffect(() => {
		loadActivity(id)
	}, [loadActivity, id])

	if (!activity) return <Spinner content={'Loading activity...'} />
	const { category, title, date, description } = activity!
	return (
		<Card fluid>
			<Image
				src={`/assets/categoryImages/${category}.jpg`}
				wrapped
				ui={false}
			/>
			<Card.Content>
				<Card.Header>{title}</Card.Header>
				<Card.Meta>
					<span>{date}</span>
				</Card.Meta>
				<Card.Description>{description}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button.Group widths={2}>
					<Button
						as={Link} to={'/manage/' + activity.id}
						basic
						color='blue'
						content='Edit'
					/>
					<Button
						onClick={() => history.push('/activities')}
						basic
						color='grey'
						content='Cancel'
					/>
				</Button.Group>
			</Card.Content>
		</Card>
	)
}

export default observer(ActivityDetails)

import React, { useState, useEffect, FC, Fragment, SyntheticEvent } from 'react'
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity'
import { Navbar } from '../../features/nav/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import agent from '../api/agent'
import { Spinner } from './Spinner'

const getActivities = () => agent.Activities.list()

const App: FC = () => {
	const [activities, setActivities] = useState<IActivity[]>([])
	const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
		null
	)
	const [editMode, setEditMode] = useState(false)
	const [loading, setLoading] = useState(true)
	const [submitting, setSubmitting] = useState(false)
	const [target, setTarget] = useState('')

	const handleSelectActivity = (id: string) => {
		setSelectedActivity(activities.find(a => a.id === id) || null)
		setEditMode(false)
	}

	const handleCreateActivity = (activity: IActivity) => {
		setSubmitting(true)
		agent.Activities.create(activity).then(() => {
			setActivities([...activities, activity])
			setSelectedActivity(activity)
			setEditMode(false)
		}).then(() => setSubmitting(false))
	}

	const handleEditActivity = (activity: IActivity) => {
		setSubmitting(true)
		agent.Activities.update(activity).then(() => {
			setActivities([...activities.filter(a => a.id !== activity.id), activity])
			setSelectedActivity(activity)
			setEditMode(false)
		}).then(() => setSubmitting(false))
	}

	const handleOpenCreateForm = () => {
		setSelectedActivity(null)
		setEditMode(true)
	}

	const handleDeleteActivity = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
		setSubmitting(true)
		setTarget(e.currentTarget.name)
		agent.Activities.delete(id).then(() => {
			setActivities([...activities.filter(a => a.id !== id)])
		}).then(() => setSubmitting(false))
	}

	useEffect(() => {
		getActivities().then(response => {
			let activities: IActivity[] = []
			response.forEach(activity => {
				activity.date = activity.date.split('.')[0]
				activities.push(activity)
			})
			setActivities(activities)
		}).then(() => setLoading(false))
	}, [])
	
	if (loading) return <Spinner content='Loading activities...' />
	return (
		<Fragment>
			<Navbar openCreateForm={handleOpenCreateForm} />
			<Container style={{ marginTop: '7em' }}>
				<ActivityDashboard
					key={(selectedActivity && selectedActivity.id) || 0}
					activities={activities}
					selectActivity={handleSelectActivity}
					activity={selectedActivity}
					editMode={editMode}
					setEditMode={setEditMode}
					setSelectedActivity={setSelectedActivity}
					createActivity={handleCreateActivity}
					editActivity={handleEditActivity}
					deleteActivity={handleDeleteActivity}
					submitting={submitting}
					target={target}
				/>
			</Container>
		</Fragment>
	)
}

export default App

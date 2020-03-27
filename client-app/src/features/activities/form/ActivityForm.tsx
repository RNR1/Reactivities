import React, { FC, useState, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput'
import TextAreaInput from '../../../app/common/form/TextAreaInput'
import SelectInput from '../../../app/common/form/SelectInput'
import { category } from '../../../app/common/options/categoryOptions'
import DateInput from '../../../app/common/form/DateInput'
import * as utils from '../../../app/common/util/util'
import { validate } from './validate'
import { RootStoreContext } from '../../../app/stores/rootStore'

interface IParams {
	id: string
}

const ActivityForm: FC<RouteComponentProps<IParams>> = props => {
	const rootStore = useContext(RootStoreContext)
	const { submitting } = rootStore.activityStore
	const { createActivity, editActivity, loadActivity } = rootStore.activityStore
	const { combineDateAndTime, redirectFromForm } = utils
	const { id } = props.match.params

	const [activity, setActivity] = useState(new ActivityFormValues())
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (id) {
			setLoading(true)
			loadActivity(id)
				.then(activity => setActivity(new ActivityFormValues(activity)))
				.finally(() => setLoading(false))
		}
	}, [loadActivity, id])

	const onSubmit = (values: any) => {
		const { date, time, ...activity } = values
		const dateAndTime = combineDateAndTime(date, time)
		activity.date = dateAndTime
		if (!activity.id) {
			let newActivity = {
				...activity,
				id: uuid()
			}
			createActivity(newActivity)
		} else {
			editActivity(activity)
		}
	}

	return (
		<Grid>
			<Grid.Column width={10}>
				<Segment clearing>
					<FinalForm
						validate={validate}
						initialValues={activity}
						onSubmit={onSubmit}
						render={({ handleSubmit, invalid, pristine }) => (
							<Form onSubmit={handleSubmit} loading={loading}>
								<Field
									name='title'
									placeholder='Title'
									value={activity.title}
									component={TextInput}
								/>
								<Field
									name='description'
									rows={3}
									placeholder='Description'
									value={activity.description}
									component={TextAreaInput}
								/>
								<Field
									name='category'
									options={category}
									placeholder='Category'
									value={activity.category}
									component={SelectInput}
								/>
								<Form.Group widths='equal'>
									<Field
										component={DateInput}
										name='date'
										date={true}
										placeholder='Date'
										value={activity.date}
									/>
									<Field
										component={DateInput}
										name='time'
										time={true}
										placeholder='Time'
										value={activity.date}
									/>
								</Form.Group>
								<Field
									name='city'
									component={TextInput}
									placeholder='City'
									value={activity.city}
								/>
								<Field
									name='venue'
									component={TextInput}
									placeholder='Venue'
									value={activity.venue}
								/>
								<Button
									loading={submitting}
									disabled={loading || invalid || pristine}
									floated='right'
									positive
									type='submit'
									content='Submit'
								/>
								<Button
									onClick={() => redirectFromForm(activity.id)}
									disabled={loading}
									floated='right'
									type='button'
									content='Cancel'
								/>
							</Form>
						)}
					/>
				</Segment>
			</Grid.Column>
		</Grid>
	)
}

export default observer(ActivityForm)

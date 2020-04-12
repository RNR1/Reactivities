import { IUser } from './../../models/user'
import { IActivity, IAttendee } from './../../models/activity'
import { history } from './../../../'

export const combineDateAndTime = (date: Date, time: Date) => {
	// const hour = time.getHours()
	// const minutes = time.getMinutes()
	// const timeString = hour + ':' + minutes + ':00'

	// const year = date.getFullYear()
	// const month = date.getMonth() + 1
	// const day = date.getDate()
	// const dateString = `${year}-${month}-${day}`
	const dateString = date.toISOString().split('T')[0]
	const timeString = time.toISOString().split('T')[1]

	return new Date(dateString + 'T' + timeString)
}

const goToActivities = () => history.push('/activities')
const goToActivity = (id: string) => history.push('/activities/' + id)

export const redirectFromForm = (id: string | undefined) => {
	id ? goToActivity(id) : goToActivities()
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
	activity.date = new Date(activity.date)
	activity.isGoing = activity.attendees.some(a => a.username === user.username)
	activity.isHost = activity.attendees.some(
		a => a.username === user.username && a.isHost
	)
	return activity
}

export const createAttendee = (user: IUser): IAttendee => {
	return {
		displayName: user.displayName,
		isHost: false,
		username: user.username,
		image: user.image!
	}
}
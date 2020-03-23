import { history } from './../../../'

export const combineDateAndTime = (date: Date, time: Date) => {
	const hour = time.getHours()
	const minutes = time.getMinutes()
	const timeString = hour + ':' + minutes + ':00'

	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const dateString = `${year}-${month}-${day}`

	return new Date(dateString + ' ' + timeString)
}

const goToActivities = () => history.push('/activities')
const goToActivity = (id: string) => history.push('/activities/' + id)

export const redirectFromForm = (id: string | undefined) => {
  id ? goToActivity(id) : goToActivities()
}
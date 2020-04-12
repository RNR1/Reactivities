import { setActivityProps, createAttendee } from './../common/util/util'
import { RootStore } from './rootStore'
import { toast } from 'react-toastify'
import { history } from './../..'
import { IActivity, IAttendee } from './../models/activity'
import { observable, action, computed, runInAction, reaction, toJS } from 'mobx'
import { SyntheticEvent } from 'react'
import agent from '../api/agent'
import {
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from '@microsoft/signalr'

const LIMIT = 2

export default class ActivityStore {
	rootStore: RootStore
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore

		reaction(
			() => this.predicate.keys(),
			() => {
				this.page = 0
				this.activityRegistry.clear()
				this.loadActivities()
			}
		)
	}

	@observable activityRegistry = new Map()
	@observable activity: IActivity | undefined
	@observable loading = false
	@observable loadingInitial = false
	@observable submitting = false
	@observable target = ''
	@observable.ref hubConnection: HubConnection | null = null
	@observable activityCount = 0
	@observable page = 0
	@observable predicate = new Map()

	@action setPredicate = (predicate: string, value: string | Date) => {
		this.predicate.clear()
		if (predicate !== 'all')
			this.predicate.set(predicate, value)
	}

	@computed get axiosParams() {
		const params = new URLSearchParams()
		params.append('limit', String(LIMIT))
		params.append('offset', `${this.page ? this.page * LIMIT : 0}`)
		this.predicate.forEach((value, key) => {
			if (key === 'startDate') {
				params.append(key, value.toISOString())
			} else {
				params.append(key, value)
			}
		})
		return params
	}

	@computed get totalPages() {
		return Math.ceil(this.activityCount / LIMIT)
	}

	@action setPage = (page: number) => {
		this.page = page
	}

	@action createHubConnection = () => {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(process.env.REACT_APP_CHAT_URL!, {
				accessTokenFactory: () => this.rootStore.commonStore.token!,
			})
			.configureLogging(LogLevel.Information)
			.build()

		this.hubConnection
			.start()
			.then(() => {
				console.log(this.hubConnection?.state)
				this.hubConnection?.invoke('AddToGroup', this.activity!.id)
			})
			.catch((error) => console.log('Error establishing connection: ', error))

		this.hubConnection?.on('ReceiveComment', (comment) => {
			runInAction('broadcast comment', () => {
				this.activity!.comments.push(comment)
			})
		})
	}

	@action stopHubConnection = () => {
		this.hubConnection
			?.invoke('RemoveFromGroup', this.activity!.id)
			.then(() => this.hubConnection!.stop())
			.then(() => console.log('Connection has stopped'))
			.catch((error) => console.log(error))
	}

	@action addComment = async (values: any) => {
		values.activityId = this.activity!.id
		try {
			await this.hubConnection!.invoke('SendComment', values)
		} catch (error) {
			console.log(error)
		}
	}

	@computed get activitiesByDate() {
		const activities = Array.from(this.activityRegistry.values())
		return this.groupActivitiesByDate(activities)
	}

	groupActivitiesByDate = (activities: IActivity[]) => {
		const sorted = activities.sort(
			(a, b) => a.date.getTime() - b.date.getTime()
		)

		return Object.entries(
			sorted.reduce((activities, activity) => {
				const date = activity.date.toISOString().split('T')[0]
				activities[date] = activities[date]
					? [...activities[date], activity]
					: [activity]
				return activities
			}, {} as { [key: string]: IActivity[] })
		)
	}

	@action loadActivities = async () => {
		this.loading = true
		const user = this.rootStore.userStore.user!
		try {
			const activitiesEnvelope = await agent.Activities.list(this.axiosParams)
			const {activities, activityCount} = activitiesEnvelope
			runInAction('loading activities', () => {
				activities.forEach((activity) => {
					setActivityProps(activity, user)
					this.activityRegistry.set(activity.id, activity)
				})
				this.activityCount = activityCount
				this.loading = false
			})
		} catch (error) {
			runInAction('load activities error', () => {
				this.loading = false
			})
			console.log(error)
		}
	}

	@action loadActivity = async (id: string) => {
		let activity = this.activityRegistry.get(id)
		if (activity) {
			this.activity = activity
			return toJS(activity)
		} else {
			this.loading = true
			const user = this.rootStore.userStore.user!
			try {
				activity = await agent.Activities.details(id)
				runInAction('getting activity', () => {
					setActivityProps(activity, user)
					this.activity = activity
					this.activityRegistry.set(activity.id, activity)
					this.loading = false
				})
				return activity
			} catch (error) {
				runInAction('get activity error', () => {
					this.loading = false
				})
				console.log(error)
			}
		}
	}

	@action clearActivity = () => {
		this.activity = undefined
	}

	@action createActivity = async (activity: IActivity) => {
		this.submitting = true
		const user = this.rootStore.userStore.user!
		try {
			await agent.Activities.create(activity)
			const attendee = createAttendee(user)
			attendee.isHost = true
			let attendees = []
			attendees.push(attendee)
			activity.attendees = attendees
			activity.comments = []
			activity.isHost = true
			runInAction('creating activity', () => {
				this.activityRegistry.set(activity.id, activity)
				this.submitting = false
			})
			history.push('/activities/' + activity.id)
		} catch (error) {
			runInAction('creating activity error', () => {
				this.submitting = false
			})
			toast.error('Problem Submitting data')
			console.log(error.response)
		}
	}

	@action editActivity = async (activity: IActivity) => {
		this.submitting = true
		try {
			await agent.Activities.update(activity)
			runInAction('editing activity', () => {
				this.activityRegistry.set(activity.id, activity)
				this.activity = activity
				this.submitting = false
			})
			history.push('/activities/' + activity.id)
		} catch (error) {
			runInAction('edit activity error', () => {
				this.submitting = false
			})
			toast.error('Problem Submitting data')
			console.log(error.response)
		}
	}

	@action deleteActivity = async (
		e: SyntheticEvent<HTMLButtonElement>,
		id: string
	) => {
		this.submitting = true
		this.target = e.currentTarget.name
		try {
			await agent.Activities.delete(id)
			runInAction('deleting activity', () => {
				this.activityRegistry.delete(id)
				this.submitting = false
				this.target = ''
			})
		} catch (error) {
			runInAction('delete activity error', () => {
				this.submitting = false
				this.target = ''
			})
			console.log(error)
		}
	}

	@action attendActivity = async () => {
		const user = this.rootStore.userStore.user!
		const attendee = createAttendee(user)
		this.loadingInitial = true
		try {
			await agent.Activities.attend(this.activity!.id)
			runInAction('attend activity', () => {
				if (this.activity) {
					this.activity.attendees.push(attendee)
					this.activity.isGoing = true
					this.activityRegistry.set(this.activity.id, this.activity)
					this.loadingInitial = false
				}
			})
		} catch (error) {
			runInAction('error attending to activity', () => {
				this.loadingInitial = false
			})
			toast.error('Problem signing up to activity')
		}
	}

	@action cancelAttendance = async () => {
		const user = this.rootStore.userStore.user!
		this.loadingInitial = true
		try {
			await agent.Activities.unattend(this.activity!.id)
			runInAction('cancel attendance', () => {
				if (this.activity) {
					const filter = (a: IAttendee) => a.username !== user.username
					this.activity.attendees = this.activity.attendees.filter(filter)
					this.activity.isGoing = false
					this.activityRegistry.set(this.activity.id, this.activity)
					this.loadingInitial = false
				}
			})
		} catch (error) {
			this.loadingInitial = false
			toast.error('Problem canceling attendance')
		}
	}
}

import { IActivity } from './../models/activity'
import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'
import agent from '../api/agent'

configure({ enforceActions: 'always' })

class ActivityStore {
	@observable activityRegistry = new Map()
	@observable activity: IActivity | undefined
	@observable loading = false
	@observable submitting = false
	@observable target = ''

	@computed get activitiesByDate() {
		const activities = Array.from(this.activityRegistry.values())
		return this.groupActivitiesByDate(activities)
	}

	groupActivitiesByDate = (activities: IActivity[]) => {
		const sorted = activities.sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date)
		)

		return Object.entries(sorted.reduce((activities, activity) => {
			const date = activity.date.split('T')[0]
			activities[date] = activities[date] ? [...activities[date], activity] : [activity]
			return activities
		}, {} as {[key: string]: IActivity[]}))
	}

	@action loadActivities = async () => {
		this.loading = true
		try {
			const activities = await agent.Activities.list()
			runInAction('loading activities', () => {
				activities.forEach(activity => {
					activity.date = activity.date.split('.')[0]
					this.activityRegistry.set(activity.id, activity)
				})
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
		} else {
			this.loading = true
			try {
				activity = await agent.Activities.details(id)
				runInAction('getting activity', () => {
					this.activity = activity
					this.loading = false
				})
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
		try {
			await agent.Activities.create(activity)
			runInAction('creating activity', () => {
				this.activityRegistry.set(activity.id, activity)
				this.submitting = false
			})
		} catch (error) {
			runInAction('creating activity error', () => {
				this.submitting = false
			})
			console.log(error)
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
		} catch (error) {
			runInAction('edit activity error', () => {
				this.submitting = false
			})
			console.log(error)
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
}

export default createContext(new ActivityStore())

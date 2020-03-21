import { IActivity } from './../models/activity'
import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'
import agent from '../api/agent'

configure({ enforceActions: 'always' })

class ActivityStore {
	@observable activityRegistry = new Map()
	@observable activities: IActivity[] = []
	@observable selectedActivity: IActivity | undefined
	@observable loading = false
	@observable editMode = false
	@observable submitting = false
	@observable target = ''

	@computed get activitiesByDate() {
		const activities = Array.from(this.activityRegistry.values())
		return activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
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

	@action createActivity = async (activity: IActivity) => {
		this.submitting = true
		try {
			await agent.Activities.create(activity)
			runInAction('creating activity', () => {
				this.activityRegistry.set(activity.id, activity)
				this.editMode = false
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
				this.selectedActivity = activity
				this.editMode = false
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

	@action openCreateForm = () => {
		this.editMode = true
		this.selectedActivity = undefined
	}

	@action openEditForm = (id: string) => {
		this.selectedActivity = this.activityRegistry.get(id)
		this.editMode = true
	}

	@action cancelSelectedActivity = () => {
		this.selectedActivity = undefined
	}

	@action cancelFormOpen = () => {
		this.editMode = false
	}

	@action selectActivity = (id: string) => {
		const activity = this.activityRegistry.get(id)
		this.selectedActivity = activity
		this.editMode = false
	}
}

export default createContext(new ActivityStore())

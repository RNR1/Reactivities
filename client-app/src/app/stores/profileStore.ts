import { IProfile, IPhoto, IUserActivity } from './../models/profile'
import { observable, action, runInAction, computed, reaction } from 'mobx'
import { RootStore } from './rootStore'
import agent from '../api/agent'
import { toast } from 'react-toastify'
export default class ProfileStore {
	rootStore: RootStore
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore

		reaction(
			() => this.activeTab,
			activeTab => {
				if (activeTab === 3 || activeTab === 4) {
					const predicate = activeTab === 3 ? 'followers' : 'following'
					this.loadFollowings(predicate)
				} else {
					this.followings = []
				}
			}
		)
	}

	@observable profile: IProfile | null = null
	@observable loadingProfile = true
	@observable uploadingPhoto = false
	@observable loading = false
	@observable followings: IProfile[] = []
	@observable activeTab: number = 0
	@observable userActivities: IUserActivity[] = []
	@observable loadingActivities = false

	@computed get isCurrentUser() {
		return this.rootStore.userStore?.user?.username === this.profile?.username
	}

	@action loadUserActivities = async (username: string, predicate?: string) => {
		this.loadingActivities = true
		try {
			const activities = await agent.Profiles.listActivities(username, predicate!)
			runInAction('loading user activities', () => {
				this.userActivities = activities
				this.loadingActivities = false
			})
		} catch (error) {
			toast.error('Problem loading activities')
			runInAction('error loading user activities', () => {
				this.loadingActivities = false
			})
		}
	}

	@action setActiveTab = (activeIndex: number) => {
		this.activeTab = activeIndex
	}

	@action loadProfile = async (username: string) => {
		this.loadingProfile = true
		try {
			const profile = await agent.Profiles.get(username)
			runInAction('loading profile', () => {
				this.profile = profile
				this.loadingProfile = false
			})
		} catch (error) {
			runInAction('error loading profile', () => {
				this.loadingProfile = false
			})
			console.log(error)
		}
	}

	@action updateProfile = async (profile: Partial<IProfile>) => {
		try {
			await agent.Profiles.update(profile)
			runInAction('updating profile', () => {
				if (
					profile.displayName !== this.rootStore.userStore.user!.displayName
				) {
					this.rootStore.userStore.user!.displayName = profile.displayName!
				}
				this.profile = { ...this.profile!, ...profile }
				this.loading = false
			})
		} catch (error) {
			toast.error('Problem updating your profile')
		}
	}

	@action uploadPhoto = async (file: Blob) => {
		this.uploadingPhoto = true
		try {
			const photo = await agent.Profiles.uploadPhoto(file)
			runInAction('uploading photo', () => {
				if (this.profile) {
					this.profile.photos.push(photo)
					if (photo.isMain && this.rootStore.userStore.user) {
						this.rootStore.userStore.user.image = photo.url
						this.profile.image = photo.url
					}
				}
				this.uploadingPhoto = false
			})
		} catch (error) {
			console.log(error)
			toast.error('Problem uploading photo')
			runInAction('error uploading photo', () => {
				this.uploadingPhoto = false
			})
		}
	}

	@action setMainPhoto = async (photo: IPhoto) => {
		this.loading = true
		try {
			await agent.Profiles.setMainPhoto(photo.id)
			runInAction('setting main photo', () => {
				this.rootStore.userStore.user!.image = photo.url
				this.profile!.photos.find((a) => a.isMain)!.isMain = false
				this.profile!.photos.find((a) => a.id === photo.id)!.isMain = true
				this.profile!.image = photo.url
				this.loading = false
			})
		} catch (error) {
			toast.error('Problem setting photo as main')
			runInAction('error setting main photo', () => {
				this.loading = false
			})
		}
	}

	@action deletePhoto = async (photo: IPhoto) => {
		this.loading = true
		try {
			await agent.Profiles.deletePhoto(photo.id)
			runInAction('deleting photo', () => {
				this.profile!.photos = this.profile!.photos.filter(
					(a) => a.id !== photo.id
				)
				this.loading = false
			})
		} catch (error) {
			toast.error('Problem deleting the photo')
			runInAction('error deleting photo', () => {
				this.loading = false
			})
		}
	}

	@action follow = async (username: string) => {
		this.loading = true
		try {
			await agent.Profiles.follow(username)
			runInAction('following user', () => {
				this.profile!.following = true
				this.profile!.followersCount++
				this.loading = false
			})
		} catch (error) {
			toast.error('Problem following user')
			runInAction('error following user', () => {
				this.loading = false
			})
		}
	}

	@action unfollow = async (username: string) => {
		this.loading = true
		try {
			await agent.Profiles.unfollow(username)
			runInAction('following user', () => {
				this.profile!.following = false
				this.profile!.followersCount--
				this.loading = false
			})
		} catch (error) {
			toast.error('Problem unfollowing user')
			runInAction('error unfollowing user', () => {
				this.loading = false
			})
		}
	}

	@action loadFollowings = async (predicate: string) => {
		this.loading = true
		try {
			const profiles = await agent.Profiles.listFollowings(
				this.profile!.username,
				predicate
			)
			runInAction('getting followings', () => {
				this.followings = profiles
				this.loading = false
			})
		} catch (error) {
			toast.error('Problem loading followings')
			runInAction('error loading followings', () => {
				this.loading = false
			})
		}
	}
}

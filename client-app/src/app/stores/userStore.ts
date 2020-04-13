import { IUser, IUserFormValues } from './../models/user'
import { observable, computed, action, runInAction } from 'mobx'
import agent from '../api/agent'
import { RootStore } from './rootStore'
import { history } from '../..'

export default class UserStore {
	rootStore: RootStore
	constructor(rootStore: RootStore) {
		this.rootStore = rootStore
	}

	@observable user: IUser | null = null
	@observable loading = false

	@computed get isLoggedIn() {
		return !!this.user
	}

	@action login = async (values: IUserFormValues) => {
		try {
			const user = await agent.User.login(values)
			runInAction('logging user in', () => {
				this.user = user
			})
			this.rootStore.commonStore.setToken(user.token)
			this.rootStore.modalStore.closeModal()
			history.push('/activities')
		} catch (error) {
			throw error
		}
	}

	@action register = async (values: IUserFormValues) => {
		try {
			const user = await agent.User.register(values)
			this.rootStore.commonStore.setToken(user.token)
			this.rootStore.modalStore.closeModal()
			history.push('/activities')
		} catch (error) {
			throw error
		}
	}

	@action logout = () => {
		this.rootStore.commonStore.setToken(null)
		this.user = null
		history.push('/')
	}

	@action getUser = async () => {
		try {
			const user = await agent.User.current()
			runInAction('getting user', () => {
				this.user = user
			})
		} catch (error) {
			console.log(error)
		}
	}

	@action fbLogin = async (response: any) => {
		try {
			this.loading = true
			const user = await agent.User.fbLogin(response.accessToken)
			runInAction('Login with facebook', () => {
				this.user = user
				this.rootStore.commonStore.setToken(user.token)
				this.rootStore.modalStore.closeModal()
				this.loading = false
			})
			history.push('/activities')
		} catch (error) {
			runInAction('Error logging in with facebook', () => {
				this.loading = false
			})
			throw error
		}
	}
}

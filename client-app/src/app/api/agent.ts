import { IActivityEnvelope } from './../models/activity'
import { IPhoto } from './../models/profile'
import { IUserFormValues } from './../models/user'
import { history } from '../..'
import axios, { AxiosResponse } from 'axios'
import { IActivity } from '../models/activity'
import { toast } from 'react-toastify'
import { IUser } from '../models/user'
import { IProfile } from '../models/profile'

axios.defaults.baseURL = process.env.REACT_APP_API_URL

axios.interceptors.request.use(
	(config) => {
		const token = window.localStorage.getItem('jwt')
		if (token) config.headers.Authorization = `Bearer ${token}`
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(undefined, (error) => {
	if (error.message === 'Network Error' && !error.response) {
		toast.error('Network error - make sure API is running!')
	} else {
		const { status, data, config, headers } = error.response
		const { method } = config
		const { errors } = data
		if (status === 404) {
			history.push('/404')
		}
		if (
			status === 401 &&
			headers['www-authenticate'].includes(
				'Bearer error="invalid_token", error_description="The token expired'
			)
		) {
			window.localStorage.removeItem('jwt')
			history.push('/')
			toast.info('Your session has expired, please login again')
		}
		if (status === 400 && method === 'get' && errors.hasOwnProperty('id')) {
			history.push('/404')
		}
		if (status === 500) {
			toast.error('Server error - check the terminal for more info!')
		}
		throw error.response
	}
})

const responseBody = (response: AxiosResponse) => response.data

const requests = {
	get: (url: string) => axios.get(url).then(responseBody),
	post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
	put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
	delete: (url: string) => axios.delete(url).then(responseBody),
	postForm: (url: string, file: Blob) => {
		let formData = new FormData()
		formData.append('File', file)
		return axios
			.post(url, formData, {
				headers: { 'Content-Type': 'multipart/form-date' },
			})
			.then(responseBody)
	},
}

const Activities = {
	list: (params: URLSearchParams): Promise<IActivityEnvelope> =>
		axios.get('/activities', { params }).then(responseBody),
	details: (id: string) => requests.get('/activities/' + id),
	create: (activity: IActivity) => requests.post('/activities', activity),
	update: (activity: IActivity) =>
		requests.put('/activities/' + activity.id, activity),
	delete: (id: string) => requests.delete('/activities/' + id),
	attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
	unattend: (id: string) => requests.delete(`/activities/${id}/attend`),
}

const User = {
	current: (): Promise<IUser> => requests.get('/user'),
	login: (user: IUserFormValues): Promise<IUser> =>
		requests.post('/user/login', user),
	register: (user: IUserFormValues): Promise<IUser> =>
		requests.post('/user/register', user),
	fbLogin: (accessToken: string) =>
		requests.post(`/user/facebook`, { accessToken }),
}

const Profiles = {
	get: (username: string): Promise<IProfile> =>
		requests.get('/profiles/' + username),
	uploadPhoto: (photo: Blob): Promise<IPhoto> =>
		requests.postForm('/photos', photo),
	setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
	deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
	update: (profile: Partial<IProfile>) => requests.put('/profiles', profile),
	follow: (username: string) =>
		requests.post(`/profiles/${username}/follow`, {}),
	unfollow: (username: string) =>
		requests.delete(`/profiles/${username}/follow`),
	listFollowings: (username: string, predicate: string) =>
		requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
	listActivities: (username: string, predicate: string) =>
		requests.get(`/profiles/${username}/activities?predicate=${predicate}`),
}

export default { Activities, User, Profiles }

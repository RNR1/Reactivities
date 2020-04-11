import React, { FC, useContext, useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import { observer } from 'mobx-react-lite'
import { Spinner } from '../../../app/layout/Spinner'
import { RootStoreContext } from '../../../app/stores/rootStore'
import InfiniteScroll from 'react-infinite-scroller'
import ActivityFilters from './ActivityFilters'

const ActivityDashboard: FC = () => {
	const rootStore = useContext(RootStoreContext)
	const { loading, loadActivities } = rootStore.activityStore
	const { setPage, page, totalPages } = rootStore.activityStore
	const [loadingNext, setLoadingNext] = useState(false)

	const handleGetNext = () => {
		setLoadingNext(true)
		setPage(page + 1)
		loadActivities().then(() => setLoadingNext(false))
	}

	useEffect(() => {
		loadActivities()
	}, [loadActivities])

	if (loading && page === 0) return <Spinner content='Loading activities...' />
	return (
		<Grid>
			<Grid.Column width={10}>
				<InfiniteScroll
					pageStart={0}
					loadMore={handleGetNext}
					hasMore={!loadingNext && page + 1 < totalPages}
					initialLoad={false}>
					<ActivityList />
				</InfiniteScroll>
			</Grid.Column>
			<Grid.Column width={6}>
				<ActivityFilters />
			</Grid.Column>
			<Grid.Column width={10}>
				<Loader active={loadingNext} />
			</Grid.Column>
		</Grid>
	)
}

export default observer(ActivityDashboard)

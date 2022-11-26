export const queriesKeys = {
    'logged': 'logged/get',
    'getRepos': 'repos/all/get',
    'getRepoParticipation': 'repos/one/participation/get',
    'getUser': 'users/one/get',
    'getFollowers': 'followers/all/get',
    'getFollows': 'follows/all/get',
    'getFirstCommit': 'users/commits/get/first',
    'getLastCommit': 'users/commits/get/last',
    'getMonthCommits': 'users/commits/get/month',
    'getLatestRepos': 'users/repos/get/latest',
    'getStarredRepos': `users/repos/get/starred`,
    'getFamousUsers': `users/get/famous`,
    'getFamousRepos': `repos/get/famous`,
    'getAllUsers': `users/get/all`,
    'getLanguageRepos': `language/repos/get/all`,
    'getOneRepo': `repos/one/get`,
    'getRepoDailyCommits': `repos/one/commits/daily/get`,

    'getTopMovies': `movies/top/get`,
    'getLatestMovies': `movies/latest/get`,

    'getTopGenres': `genres/top/get`,
    'getSummary': 'summary/get',

    'getTopPeople': `people/top/get`,
    'getTopKeywords': `keywords/top/get`,

    'getGenreTopMovies': `genres/movies/top/get`,

    getTopEntities: (entityName: string) => `${entityName}/top.get`,
    getTopConnectedMovies: (name: string) => `${name}/movies/top/get`,

    getEntities: (name: string) => `${name}/all/get`,

}
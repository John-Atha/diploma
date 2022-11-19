## Services

### Service 1: Data Access API
#### Endpoints
| Method | url | auth | pagi-params | ordering-params |
| --- | --- | --- | --- | --- |
| GET | /movies | | Y | Y |
| GET | /movies/\<id\> | | | |
| GET | /movies/\<id\>/similar | | Y | Y |
| GET | /movies/top | |  |  |
| GET | /movies/latest | | Y |  |
| --- | --- | --- | --- | --- |
| GET | /genres | | | Y |
| GET | /genres/\<name\>
| GET | /genres/\<name\>/movies | | Y | Y |
| --- | --- | --- | --- | --- |
| GET | /keywords | | Y | Y
| GET | /keywords/\<name\>
| GET | /keywords/\<name\>/movies | | Y | Y |
| --- | --- | --- | --- | --- |
| GET | /people | | Y | Y
| GET | /people/\<id\>
| GET | /people/\<id\>/movies | | Y | Y |
| --- | --- | --- | --- | --- |
| GET | /companies | | Y | Y |
| GET | /companies/\<name\>
| GET | /companies/\<name\>/movies | | Y | Y |
| --- | --- | --- | --- | --- |
| GET | /countries | | Y | Y |
| GET | /countries/\<name\>
| GET | /countries/\<name\>/movies | | Y | Y |
| --- | --- | --- | --- | --- |
| GET | /languages | | Y | Y |
| GET | /languages/\<name\>
| GET | /languages/\<name\>/movies | | Y | Y |
| --- | --- | --- | --- | --- |
| --- | --- | --- | --- | --- |
| GET | /search/movies | | Y |  |
| GET | /search/actors | | Y |  |
| GET | /search/keywords | | Y | |
| --- | --- | --- | --- | --- |
| GET | /ratings | Y | Y | Y
| POST | /ratings | Y
| PUT | /ratings | Y
| --- | --- | --- | --- | --- |
| POST | /login
| POST | /register
| --- | --- | --- | --- | --- |
| GET | /profile | Y
| PUT | /password | Y

### Service 2: GNN API
#### Endpoints
| Method | url | auth | pagi-params | ordering-params |
| --- | --- | --- | --- | --- |
| GET | /users/\<id\>/suggestions | Y | Y
| GET | /train | superuser
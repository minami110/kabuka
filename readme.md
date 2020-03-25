[![Build Status](https://travis-ci.com/minami110/kabuka.svg?branch=pre_deploy)](https://travis-ci.com/minami110/kabuka)
[![Coverage Status](https://coveralls.io/repos/github/minami110/kabuka/badge.svg?branch=pre_deploy)](https://coveralls.io/github/minami110/kabuka?branch=dev)


# kabuka
* https://minami110.github.io/kabuka/


## for developers
* use docker (docker-compose)

### clone
* `git clone https://github.com/minami110/kabuka/`

### run dev server
* `cd kabuka`
* `docker-compose up -d`
* goto `http://localhost:3000/kabuka/`

### deploy to github pages
* push or merge into `origin/pre_deploy` branch
* ci: TravisCI
* coverage: Coverall

### Spleadsheet endpoint
* using Google Script API endpoint
* https://script.google.com/d/1pxkDl1PLTqzwASYQKoG9AuJGierartQ84xZB-E9xf1hcWU_GJjNi03qZ/edit

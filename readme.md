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
* github pages uses `origin/master /docs`
* no CI (とりあえず..)

* `docker-compose exec kabuka yarn generate`
* `mv ./src/dist ./docs`
* `git add .`
* `git commit -m "deploy"`
* `git push`
* merge to master

### Google accounts
* https://docs.google.com/spreadsheets/d/1MA-ufB6FPBc9kdq4H6ZoM0TX0mTeRFwlWNWuBxrYERk/edit#gid=0
* kabuka.acnh
* Doubutsu_0320
*
*

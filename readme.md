# kabuka
* https://minami110.github.io/kabuka/


## for developers

### clone
* `git clone https://github.com/minami110/kabuka/`

### run dev server
* `cd kabuka`
* `docker-compose up -d`
* goto `http://localhost:3000/kabuka/`

### deploy to github pages
* github pages uses `origin/master /docs`

* `docker-compose exec kabuka yarn generate`
* `mv ./src/dist ./docs`
* `git add .`
* `git commit -m "deploy"`
* `git push origin master`
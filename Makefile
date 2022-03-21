# $(name)があるコマンドは引数としてname=hogehogeを与える
migration-create:
    docker container exec -it todos_backend sh -c "npm run typeorm:migration:create $(name)"
migration-generate:
    docker container exec -it todos_backend sh -c "npm run typeorm:migration:generate $(name)"
migration-run:
    docker container exec -it todos_backend sh -c "npm run typeorm:migration:run"
migration-revert:
    docker container exec -it todos_backend sh -c "npm run typeorm:migration:revert"


$path = "D:\xibo\docker-compose.yml"
$content = @"
version: '3.8'

services:
    cms-db:
        image: mysql:5.7
        command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
        volumes:
            - "./shared/db:/var/lib/mysql:Z"
        environment:
            - MYSQL_DATABASE=cms
            - MYSQL_USER=cms
            - MYSQL_RANDOM_ROOT_PASSWORD=yes
        mem_limit: 1g
        env_file: config.env
        restart: always
        networks:
            - dokploy-overlay
    cms-xmr:
        image: xibosignage/xibo-xmr:0.9
        ports:
            - "9505:9505"
        restart: always
        mem_limit: 256m
        env_file: config.env
        networks:
            - dokploy-overlay
    cms-web:
        image: xibosignage/xibo-cms:latest
        volumes:
            - "./shared/cms/custom:/var/www/cms/custom:Z"
            - "./shared/backup:/var/www/backup:Z"
            - "./shared/cms/web/theme/custom:/var/www/cms/web/theme/custom:Z"
            - "./shared/cms/library:/var/www/cms/library:Z"
            - "./shared/cms/web/userscripts:/var/www/cms/web/userscripts:Z"
            - "./shared/cms/ca-certs:/var/www/cms/ca-certs:Z"
        restart: always
        environment:
            - MYSQL_HOST=cms-db
            - XMR_HOST=cms-xmr
            - CMS_USE_MEMCACHED=true
            - MEMCACHED_HOST=cms-memcached
        env_file: config.env
        ports:
            - "8088:80"
        mem_limit: 1g
        networks:
            - dokploy-overlay
        depends_on:
            - cms-db
            - cms-xmr
            - cms-memcached
    cms-memcached:
        image: memcached:alpine
        command: memcached -m 15
        restart: always
        mem_limit: 100M
        networks:
            - dokploy-overlay
    cms-quickchart:
        image: ianw/quickchart
        restart: always
        networks:
            - dokploy-overlay

networks:
    dokploy-overlay:
        external: true
"@

try {
    [System.IO.File]::WriteAllText($path, $content)
    Write-Host "✅ File written successfully to $path (Standard clean config)" -ForegroundColor Green
} catch {
    Write-Error "❌ Failed to write file: $_"
}

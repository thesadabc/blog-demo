# elasticsearch cluster

## 启动命令

```bash
    mkdir -m 777 ./volumes-es01 && docker compose up -d es01.example.com
    mkdir -m 777 ./volumes-es02 && docker compose up -d es02.example.com
    mkdir -m 777 ./volumes-es03 && docker compose up -d es03.example.com
    mkdir -m 777 ./volumes-es04 && docker compose up -d es04.example.com
    docker compose up -d kibana.example.com
```

## kibana

[http://kibana.example.com:5601/app/dev_tools](http://kibana.example.com:5601/app/dev_tools)

## 命令测试

```bash
    # 查看集群信息
    curl "http://es01.example.com:9200/"

    # 查看节点信息
    curl "http://es01.example.com:9200/_cat/nodes"
```

# hadoop3.2.1-hdfs集群

4节点的hdfs集群

## 启动命令

```bash
    docker compose up -d nn.hdfs.example.com
    docker compose up -d dn01.hdfs.example.com
    docker compose up -d dn02.hdfs.example.com
    docker compose up -d dn03.hdfs.example.com
    docker compose up -d dn04.hdfs.example.com
```

## webhdfs地址

[http://nn.hdfs.example.com:9870/](http://nn.hdfs.example.com:9870/)

## 命令测试

注意要能解析到对应域名，可以进入统一网络`--net=hostvpc`，或者指定域名解析`--dns x.x.x.x`

```bash

# 上传下载测试
docker run --rm -v `pwd`/data.csv:/data.csv bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
    hdfs dfs -fs hdfs://nn.hdfs.example.com:9000 -put /data.csv /data.csv

docker run --rm bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
    hdfs dfs -fs hdfs://nn.hdfs.example.com:9000 -ls /

docker run --rm bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
    hdfs dfs -fs hdfs://nn.hdfs.example.com:9000 -text /data.csv

```

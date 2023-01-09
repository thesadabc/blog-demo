# kraft模式的kafka集群

不依赖 ZooKeeper

[Kafka Without ZooKeeper](https://developer.confluent.io/learn/kraft/)

## 启动命令

```bash
    # 依赖1001用户权限
    mkdir -m 777 ./volumes-kafka01 && docker compose up -d kafka01.example.com
    mkdir -m 777 ./volumes-kafka02 && docker compose up -d kafka02.example.com
    mkdir -m 777 ./volumes-kafka03 && docker compose up -d kafka03.example.com
    mkdir -m 777 ./volumes-kafka04 && docker compose up -d kafka04.example.com
```

## 命令测试

注意要能解析到对应域名，可以进入统一网络`--net=hostvpc`，或者指定域名解析`--dns x.x.x.x`

```bash

# 获取Cluster ID
docker run --rm bitnami/kafka kafka-cluster.sh cluster-id \
    --bootstrap-server "kafka01.example.com:9092,kafka02.example.com:9092,kafka03.example.com:9092,kafka04.example.com:9092"

# 消费数据
docker run --rm bitnami/kafka kafka-console-consumer.sh \
    --bootstrap-server "kafka01.example.com:9092,kafka02.example.com:9092,kafka03.example.com:9092,kafka04.example.com:9092" \
    --topic "datastream.test"
```

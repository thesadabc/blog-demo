# hadoop3.2.1-yarn集群

## 启动命令

```bash
    docker compose up -d rm.yarn.example.com
    docker compose up -d nm01.yarn.example.com
    docker compose up -d nm02.yarn.example.com
    docker compose up -d nm03.yarn.example.com
    docker compose up -d nm04.yarn.example.com
    # docker compose up -d hs.yarn.example.com # 可以不启动
```

## 任务调度历史与节点信息

[http://rm.yarn.example.com:8088/cluster](http://rm.yarn.example.com:8088/cluster)

## 命令测试

注意要能解析到对应域名，可以进入统一网络`--net=hostvpc`，或者指定域名解析`--dns x.x.x.x`

```bash

# 运行mapreduce计算圆周率
docker run --rm --env-file ./yarn.env \
    bde2020/hadoop-namenode:2.0.0-hadoop3.2.1-java8 \
    hadoop jar /opt/hadoop-3.2.1/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.2.1.jar pi 3 3

```

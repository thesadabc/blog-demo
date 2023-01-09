# Spark独立集群

## 启动命令

```bash
    docker compose up -d master.spark.example.com
    docker compose up -d w01.spark.example.com
    docker compose up -d w02.spark.example.com
    docker compose up -d w03.spark.example.com
    docker compose up -d w04.spark.example.com
```

## 服务器信息

[http://master.spark.example.com:8080/](http://master.spark.example.com:8080/)

## 命令测试

注意要能解析到对应域名，可以进入统一网络`--net=hostvpc`，或者指定域名解析`--dns x.x.x.x`

```bash

# spark-shell
docker run --rm -it bitnami/spark:3.3 spark-shell --master spark://master.spark.example.com:7077

echo 'sc.textFile("hdfs://nn.hdfs.example.com:9000/data.csv").count()' \
| docker run --rm -i bitnami/spark:3.3 \
    spark-shell --master spark://master.spark.example.com:7077

# 使用集群模式计算pi
docker run --rm bitnami/spark:3.3 \
    spark-submit --master spark://master.spark.example.com:7077 --deploy-mode cluster\
    --class org.apache.spark.examples.SparkPi ./examples/jars/spark-examples_2.12-3.3.1.jar

# 在集群外，不能使用client模式提交任务
```

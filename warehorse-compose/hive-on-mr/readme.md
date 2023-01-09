# 基于MapReduce的Hive服务

## 启动命令

0. 依赖`jdbc.jar`, 可以从[dev.mysql.com](https://dev.mysql.com/downloads/connector/j/)下载
1. 依赖数据库，当前组件使用外部`mysql`作为hive元数据存储, 需要修改环境变量配置
2. 启动组件`yarn`后，可以使用[hadoop-yarn](../hadoop-yarn)的调度执行`MapReduce`,在`docker-compose.yml`可以配置导入对应环境变量
2. 不配置`yarn`环境则使用`LocalJobRunner`进行本地运算，在`docker-compose.yml`可以移除对应环境变量

```bash
    # 首次启动需要初始化数据库
    docker compose run hive2.example.com schematool --dbType mysql --initSchema

    # 启动服务
    docker compose up -d hive2.example.com
```

## 服务器信息

[http://hive2.example.com:10002](http://hive2.example.com:10002)

## 命令测试

注意要能解析到对应域名，可以进入统一网络`--net=hostvpc`，或者指定域名解析`--dns x.x.x.x`

```bash

# hive shell
docker run --rm -eHADOOP_OPTS="-Dfile.encoding=UTF-8" -it bde2020/hive \
    beeline -n root -u 'jdbc:hive2://hive2.example.com:10000'

# 直接使用-e参数无法执行, docker run传入带空格的参数不方便
# https://stackoverflow.com/a/39460934
echo 'show databases;' | docker run --rm -eHADOOP_OPTS="-Dfile.encoding=UTF-8" -i bde2020/hive \
    beeline -n root -u 'jdbc:hive2://hive2.example.com:10000' 

# 可以访问hdfs
docker run --rm bde2020/hive hdfs dfs -fs hdfs://nn.hdfs.example.com:9000 -ls /
```

## Hive on Spark

[Hive on Spark](https://cwiki.apache.org/confluence/display/Hive/Hive+on+Spark%3A+Getting+Started)

由于当前镜像版本的问题，对应的Hive版本和Spark版本无法兼容。我又不想自己打镜像，可以后续等镜像或者版本更新。

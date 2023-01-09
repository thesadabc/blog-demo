# logstash服务


本例子将日志写入[kafka](../kafka-on-kraft)与[hdfs](../hadoop-hdfs)，具体配置可以参考文档

[logstash文档](https://www.elastic.co/guide/en/logstash/current/index.html)

## 启动命令

注意要能解析到对应域名

```bash
    mkdir ./logs # 假设服务路径
    mkdir -m 777 volumes-db && docker compose up -d datastream.test
```

## 测试数据

```bash
    echo "$(date) 这是一条日志" >> test.log # 往目标文件增加日志
```

可以在`kafka`及`hdfs`中查看到对应数据

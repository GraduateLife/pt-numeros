#!/bin/sh

# 启动 Ollama 服务（后台运行）
ollama serve &

# 立即返回一个成功状态码，防止服务启动阻塞后续操作
echo "Ollama service starting..."

# 在后台异步下载模型（示例使用 llama2）
ollama pull llama2 > /var/log/ollama-download.log 2>&1 &

# 保持容器存活（必须！）
tail -f /dev/null
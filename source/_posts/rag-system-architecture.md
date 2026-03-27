---
title: 从零构建 RAG 系统：LLM 应用的核心架构
tags:
  - RAG
  - LLM
  - 向量数据库
  - LangChain
categories:
  - AIGC应用
top_img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=80'
cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80'
description: 深入解析 RAG（检索增强生成）系统的核心架构，从向量数据库到检索策略，手把手教你构建生产级 RAG 管道
abbrlink: f49383a8
date: 2026-03-27 18:00:00
---

# 🔍 从零构建 RAG 系统：LLM 应用的核心架构

> RAG (Retrieval-Augmented Generation) 是当前 LLM 落地最成熟的范式之一。本文带你深入理解 RAG 的每一个组件。

<!-- more -->

## 为什么需要 RAG？

大语言模型虽然强大，但存在几个关键问题：

{% note warning modern %}
1. **知识截止日期**：训练数据有时效性
2. **幻觉问题**：可能编造不存在的信息
3. **领域知识缺乏**：通用模型缺少专业知识
4. **无法引用来源**：回答缺乏可追溯性
{% endnote %}

RAG 通过在生成前检索相关文档，让 LLM 基于真实数据回答问题。

## 系统架构

一个完整的 RAG 系统包含以下核心组件：

```
┌─────────────────────────────────────────────────────┐
│                     RAG Pipeline                      │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  文档加载  │→│  文本切分  │→│  向量化   │           │
│  │  Loaders  │  │ Splitter │  │ Embedding │           │
│  └──────────┘  └──────────┘  └────┬─────┘           │
│                                    │                  │
│                              ┌─────▼─────┐           │
│                              │  向量数据库  │           │
│                              │ VectorStore│           │
│                              └─────┬─────┘           │
│                                    │                  │
│  ┌──────────┐  ┌──────────┐  ┌────▼─────┐           │
│  │  LLM生成  │←│ Prompt组装│←│  相似检索  │           │
│  │ Generator │  │ Template │  │ Retriever │           │
│  └──────────┘  └──────────┘  └──────────┘           │
└─────────────────────────────────────────────────────┘
```

## 代码实现

### 1. 文档处理与向量化

```python
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# 加载文档
loader = DirectoryLoader("./docs", glob="**/*.md")
documents = loader.load()

# 智能切分
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\n## ", "\n### ", "\n\n", "\n", "。", " "]
)
chunks = text_splitter.split_documents(documents)

# 向量化存储
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db"
)

print(f"✅ 已索引 {len(chunks)} 个文本块")
```

### 2. 检索增强生成

```python
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# 自定义 Prompt
template = """你是一位专业的 AI 技术专家。
基于以下检索到的上下文回答用户问题。
如果上下文中没有相关信息，请明确说明。

上下文：
{context}

问题：{question}

请给出详细、准确的回答："""

prompt = PromptTemplate(
    template=template,
    input_variables=["context", "question"]
)

# 构建 RAG Chain
llm = ChatOpenAI(model="gpt-4o", temperature=0)
retriever = vectorstore.as_retriever(
    search_type="mmr",  # 最大边际相关性
    search_kwargs={"k": 5, "fetch_k": 10}
)

rag_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True
)

# 查询
result = rag_chain.invoke({"query": "如何优化向量检索的召回率？"})
print(result["result"])
```

## 性能优化策略

| 策略 | 描述 | 效果 |
|------|------|------|
| 混合检索 | 结合向量检索 + BM25 关键词检索 | 提升召回率 20-30% |
| Reranker | 使用交叉编码器重排序 | 提升精度 15-25% |
| 查询改写 | HyDE / Multi-Query | 提升语义理解 |
| 自适应切分 | 根据文档结构智能切分 | 减少信息丢失 |
| 缓存机制 | LLM 结果 + 向量缓存 | 降低延迟和成本 |

## 总结

RAG 不仅仅是"检索 + 生成"的简单组合，而是一个需要精心设计的工程系统。后续文章将深入探讨：

- Advanced RAG 策略（Self-RAG、Corrective RAG）
- 多模态 RAG 实现
- RAG 评估框架

---

{% note info modern %}
📚 **参考资料**
- [LangChain Documentation](https://python.langchain.com/)
- [RAG Survey Paper](https://arxiv.org/abs/2312.10997)
{% endnote %}

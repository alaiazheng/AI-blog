---
title: Prompt Engineering 系统指南：从入门到精通
tags:
  - Prompt Engineering
  - LLM
  - GPT
  - Claude
categories:
  - 大模型工程化
top_img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1920&q=80'
cover: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80'
description: 系统化的 Prompt Engineering 指南，涵盖核心技巧、高级策略和实战模板
abbrlink: e8ce9a30
date: 2026-03-27 22:00:00
---

# ✨ Prompt Engineering 系统指南：从入门到精通

> Prompt 是与 LLM 对话的语言，好的 Prompt 是 AI 应用成败的关键。

<!-- more -->

## 核心原则

### 1. 清晰具体

```markdown
❌ Bad: 帮我写一段代码
✅ Good: 用 Python 编写一个函数，接收一个字符串列表，
   返回其中最长的回文字符串。要求包含类型注解和文档字符串。
```

### 2. 结构化输出

```python
prompt = """
分析以下代码的性能问题，以 JSON 格式返回：

{
  "issues": [
    {
      "severity": "high|medium|low",
      "location": "行号或函数名",
      "description": "问题描述",
      "suggestion": "优化建议",
      "estimated_improvement": "预计提升幅度"
    }
  ],
  "overall_score": 0-100,
  "summary": "整体评价"
}
"""
```

### 3. Few-shot 学习

```python
prompt = """你是一个代码审查助手。以下是审查示例：

输入：`x = eval(input())`
输出：🔴 **安全风险** - eval() 可执行任意代码，存在代码注入风险。
建议：使用 ast.literal_eval() 或针对性的类型转换。

输入：`password = "admin123"`
输出：🔴 **安全风险** - 硬编码密码，泄露风险极高。
建议：使用环境变量或密钥管理服务。

现在请审查以下代码：
{code}
"""
```

## 高级技巧

### Chain-of-Thought (CoT)

```python
prompt = """
问题：一个 API 的 P99 延迟从 200ms 飙升到 2000ms，请分析可能原因。

请按以下步骤思考：
1. 首先考虑网络层面的可能性
2. 然后分析应用层面的因素
3. 接着检查数据层面的问题
4. 最后给出排查优先级和具体步骤

逐步分析：
"""
```

### Self-Consistency

对同一个问题多次采样，取多数一致的答案：

```python
async def self_consistency(prompt: str, n: int = 5):
    """自一致性采样策略"""
    responses = await asyncio.gather(*[
        llm.generate(prompt, temperature=0.7)
        for _ in range(n)
    ])
    
    # 提取答案并投票
    answers = [extract_answer(r) for r in responses]
    return Counter(answers).most_common(1)[0][0]
```

## Prompt 模板库

| 场景 | 关键要素 | 效果 |
|------|----------|------|
| 代码生成 | 语言 + 功能 + 约束 + 示例 | ⭐⭐⭐⭐⭐ |
| 代码审查 | 角色 + 检查维度 + 输出格式 | ⭐⭐⭐⭐ |
| 文档生成 | 受众 + 风格 + 结构 + 深度 | ⭐⭐⭐⭐ |
| 数据分析 | 数据描述 + 分析目标 + 可视化需求 | ⭐⭐⭐⭐ |
| 翻译优化 | 源语言 + 领域 + 风格 + 术语表 | ⭐⭐⭐⭐⭐ |

## System Prompt 设计

```python
SYSTEM_PROMPT = """
# Role
你是一位资深的全栈工程师和 AI 架构师。

# Expertise
- 精通 Python, TypeScript, Go
- 深度理解 LLM 原理与应用
- 丰富的系统设计经验

# Guidelines
1. 代码应遵循 SOLID 原则
2. 优先考虑可维护性和可测试性
3. 安全性第一，永远不要硬编码密钥
4. 给出建议时要解释 WHY，不仅是 WHAT

# Output Format
- 使用 Markdown 格式
- 代码块标注语言
- 重要信息用 emoji 标记
- 复杂概念配图说明
"""
```

## 总结

{% note primary modern %}
🎯 **记住三个核心公式**
1. **好 Prompt = 角色 + 上下文 + 指令 + 格式 + 约束**
2. **稳定输出 = 结构化模板 + Few-shot + 温度控制**
3. **复杂推理 = CoT + Self-Consistency + 分步验证**
{% endnote %}

---

> *"Prompt Engineering is not just about talking to AI — it's about thinking clearly."*

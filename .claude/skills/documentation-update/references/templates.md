# Jinja2テンプレート例

## agents.md.j2

```jinja2
# Agent Reference

{% for category, plugins in plugins_by_category.items() %}
## {{ category|title }}

{% for plugin in plugins %}
### {{ plugin.name }}

{{ plugin.description }}

{% for agent in all_agents %}
{% if agent.plugin == plugin.name %}
- **{{ agent.name }}** (`{{ agent.model }}`)
  - {{ agent.description }}
{% endif %}
{% endfor %}

{% endfor %}
{% endfor %}

*Total agents: {{ stats.total_agents }}*
```

## agent-skills.md.j2

```jinja2
# Agent Skills Reference

{% for plugin in marketplace.plugins %}
## {{ plugin.name }}

{% for skill in all_skills %}
{% if skill.plugin == plugin.name %}
### {{ skill.name }}

{{ skill.description }}

- **Location:** `plugins/{{ plugin.name }}/skills/{{ skill.path }}/`
{% endif %}
{% endfor %}

{% endfor %}

*Total skills: {{ stats.total_skills }}*
```

## エラーハンドリング

| エラー | 原因 | 対処 |
|-------|------|------|
| Marketplace not found | `marketplace.json` が存在しない | ファイルパスを確認 |
| Template not found | `assets/*.j2` が存在しない | テンプレートファイルを確認 |
| Invalid plugin structure | プラグインに必須コンポーネントがない | プラグイン構成を確認 |
| Frontmatter parse error | YAMLシンタックスエラー | エージェントファイルを確認 |

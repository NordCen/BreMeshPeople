---
layout: default
title: News
permalink: /news/
---

# News & Ankündigungen

Neuigkeiten, Events und Ankündigungen rund um das Bremer Mesh-Netzwerk.

<hr>

{% if site.posts.size > 0 %}
{% for post in site.posts %}
<div class="news-item" markdown="1">

### [{{ post.title }}]({{ post.url }})

<span class="post-meta">{{ post.date | date: "%d.%m.%Y" }}{% if post.author %} · {{ post.author }}{% endif %}</span>

{{ post.excerpt }}

[Weiterlesen →]({{ post.url }})

<hr>

</div>
{% endfor %}
{% else %}
*Noch keine News vorhanden – schau bald wieder vorbei!*
{% endif %}

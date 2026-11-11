# Issac 假期学习手册

给家长看的假期学习手册(英文、科学、数学),单页网页。

在线查看:https://lilyhewitt.github.io/Issac-study-handbook/

英文练习 app（给孩子用，手机上做选择题）:https://lilyhewitt.github.io/Issac-study-handbook/english/
科学练习 app（三年级复习 + 四年级预习，带中文翻译）:https://lilyhewitt.github.io/Issac-study-handbook/science/
数学练习 app（应用题拆步、计算、四年级预习）:https://lilyhewitt.github.io/Issac-study-handbook/math/

## 代码结构

- `index.html`:家长手册,直接改这个文件。
- `src/`:三个练习 app 的源码。`app.html` 是共用的 app(按英文版写);`english/`、`science/`、`math/` 各自的题库、配色和首页入口;`math/bar.*` 是“画线段图”;`shared/` 是同步和自动更新。
- `english/`、`science/`、`math/` 里的 `index.html` 是打包出来的,不要手改。
- `tools/build.py`:打包。改完 `src/` 后运行 `python3 tools/build.py`。
- `tests/run.sh`:全部检查(题库、线段图、同步、每天一轮、旧存档)。**上线前必须跑**:其中“saves”会用上一个版本做出的存档打开新版本,确认孩子 iPad 上的记录不受影响。


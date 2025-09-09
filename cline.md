# CLINE.md

This file provides guidance to ai when working with code in this repository.

## AI Guidance
* 所有回答使用中文
* Ignore GEMINI.md and GEMINI-*.md files
* To save main context space, for code searches, inspections, troubleshooting or analysis, use code-searcher subagent where appropriate - giving the subagent full context background for the task(s) you assign it.
* After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding. Use your thinking to plan and iterate based on this new information, and then take the best next action.
* For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
* Before you finish, please verify your solution
* Do what has been asked; nothing more, nothing less.
* NEVER create files unless they're absolutely necessary for achieving your goal.
* ALWAYS prefer editing an existing file to creating a new one.
* NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
* When you update or modify core context files, also update markdown documentation and memory bank
* When asked to commit changes, exclude CLINE.md and CLINE-*.md referenced memory bank system files from any commits. Never delete these files.
* 增加必要的注释，注释用中文，格式满足doxygen的要求；
* 函数参数是物理量的，必须标注单位。函数内部变量是物理量的，也必须标注单位。
* 软件测试的过程用debug_log.md进行记录
* 软件需要打印必要的调试信息，调试信息的级别可控
* 需求追踪状态必须实时更新到docs/需求文档-追踪.md，更新时机包括：
  - 完成功能实现时
  - 通过测试验证时  
  - 遇到问题或阻塞时
  - 每周项目状态更新时
  - 模块间依赖关系发生变化时
* 认证检查生成的执行文件的执行情况，有错误就改，不要直接跳过
* 你必须先测试再说完成xxx功能 
* 
## Memory Bank System

This project uses a structured memory bank system with specialized context files. Always check these files for relevant information before starting work:

### Core Context Files

* **CLINE-activeContext.md** - Current session state, goals, and progress (if exists)
* **CLINE-patterns.md** - Established code patterns and conventions (if exists)
* **CLINE-decisions.md** - Architecture decisions and rationale (if exists)
* **CLINE-troubleshooting.md** - Common issues and proven solutions (if exists)
* **CLINE-config-variables.md** - Configuration variables reference (if exists)
* **CLINE-temp.md** - Temporary scratch pad (created when needed)

**Important:** Always reference the active context file first to understand what's currently being worked on and maintain session continuity.

### Requirements Tracking

* **docs/需求文档.md** - Complete requirements specification
* **docs/需求文档-追踪.md** - Requirements implementation status and progress tracking

### Memory Bank System Backups

When asked to backup Memory Bank System files, you will copy the core context files above and @.CLINE settings directory to directory @/path/to/backup-directory. If files already exist in the backup directory, you will overwrite them.

## Project Overview

-----

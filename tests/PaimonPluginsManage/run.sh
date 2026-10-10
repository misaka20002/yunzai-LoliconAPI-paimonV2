#!/usr/bin/env bash
# 离线回归：只提取函数，不执行管理脚本的安装、联网和菜单入口。
set -euo pipefail
test_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
test_tmp=$(mktemp -d)
trap 'rm -rf -- "$test_tmp"' EXIT
export GIT_CONFIG_NOSYSTEM=1 GIT_CONFIG_GLOBAL="$test_tmp/global.gitconfig"
export GIT_TERMINAL_PROMPT=0
unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_CONFIG_COUNT || true
source <(sed -n '/^# Git 插件加速：/,/^function main(){/{ /^function main(){/d; p; }' "$test_root/psign/PaimonPluginsManage.sh")
source <(sed -n '/^function path(){/,/^}/{ p; }' "$test_root/psign/PaimonPluginsManage.sh")
page=echo_page
green= red= yellow= background=
git_proxy_names=() git_proxy_paths=()
checks=0

assert_equal(){
    if [[ "$1" != "$2" ]]; then
        printf 'FAIL %s\nexpected: %s\nactual:   %s\n' "$3" "$2" "$1" >&2
        exit 1
    fi
    checks=$((checks+1))
}

make_repo(){
    git init -q "$1"
    [[ -z "${2:-}" ]] || git -C "$1" remote add origin "$2"
}

base=https://github.com/example/bot.git
for prefix in https://gh-proxy.at9.net/ https://gh.xmly.dev/ https://gh-proxy.com/ https://ghproxy.net/ https://ghfast.top/; do
    assert_equal "$(git_proxy_original_url "$prefix$base")" "$base" "strip $prefix"
done
assert_equal "$(git_proxy_original_url "https://old.example/path/https://ghfast.top/$base")" "$base" 'nested custom proxy'
assert_equal "$(git_proxy_original_url 'http://github.com/example/bot/')" 'http://github.com/example/bot/' 'HTTP and trailing slash'
for url in git@github.com:example/bot.git ssh://git@github.com/example/bot.git https://gitee.com/example/bot.git https://github.com.evil/example/bot.git https://github.com@example.net/example/bot.git https://token@github.com/example/bot.git https://proxy.example/https://github.com/example/bot.git?token=x; do
    if git_proxy_original_url "$url" >/dev/null; then
        printf 'FAIL accepted unsupported URL: %s\n' "$url" >&2
        exit 1
    fi
    checks=$((checks+1))
done
assert_equal "$(git_proxy_normalize_prefix 'proxy.example:8443/git///')" 'https://proxy.example:8443/git/' 'custom path and port'
for prefix in '' 'https://' 'https://proxy.example/?token=x' 'https://user:pass@proxy.example/' 'ssh://proxy.example/' 'https://proxy.example/https://github.com/a/b' 'proxy.example bad'; do
    if git_proxy_normalize_prefix "$prefix" >/dev/null; then
        printf 'FAIL accepted invalid prefix: %s\n' "$prefix" >&2
        exit 1
    fi
    checks=$((checks+1))
done

Plugin_Path="$test_tmp/Bot with spaces"
make_repo "$Plugin_Path" "$base"
mkdir -p "$Plugin_Path/node_modules" "$Plugin_Path/plugins/example"
make_repo "$Plugin_Path/plugins/a plugin" 'https://old.example/path/https://ghfast.top/https://github.com/example/plugin.git'
make_repo "$Plugin_Path/plugins/b-gitee" 'https://gitee.com/example/plugin.git'
make_repo "$Plugin_Path/plugins/c-ssh" 'git@github.com:example/plugin.git'
make_repo "$Plugin_Path/plugins/d-no-origin"
make_repo "$Plugin_Path/plugins/e-multiple" 'https://github.com/example/first.git'
git -C "$Plugin_Path/plugins/e-multiple" config --add remote.origin.url 'https://github.com/example/second.git'
make_repo "$Plugin_Path/plugins/f-token" 'https://token@github.com/example/private.git'
make_repo "$test_tmp/separate" 'https://github.com/example/separate.git'
git -C "$test_tmp/separate" -c user.name=Test -c user.email=test@example.invalid commit -qm init --allow-empty
git -C "$test_tmp/separate" worktree add -q "$Plugin_Path/plugins/g-worktree"
git -C "$Plugin_Path" remote add upstream https://github.com/example/upstream.git
git -C "$Plugin_Path" remote set-url --push origin git@github.com:example/bot.git
git config --global url.https://existing.example/.insteadOf https://github.com/
global_before=$(cat "$GIT_CONFIG_GLOBAL")

# 从 plugins 启动时要固定父目录，随后即使 cwd 改变也只管理所选 Bot。
cd "$Plugin_Path/plugins"
path
assert_equal "$Plugin_Path" "$test_tmp/Bot with spaces" 'absolute Bot path'
cd "$test_tmp"
git_proxy_collect
assert_equal "${#git_proxy_paths[@]}" 8 'only real repositories, including worktree'
git_proxy_show >"$test_tmp/list"
[[ $(cat "$test_tmp/list") == *'未配置 origin'* ]]

git_proxy_modify batch >"$test_tmp/cancel" 2>&1 <<<'5
n'
assert_equal "$(git_proxy_origin "$Plugin_Path")" "$base" 'batch cancel'

presets=(https://gh-proxy.at9.net/ https://gh.xmly.dev/ https://gh-proxy.com/ https://ghproxy.net/ https://ghfast.top/)
for i in "${!presets[@]}"; do
    git_proxy_modify batch >"$test_tmp/batch" 2>&1 <<<"$((i+1))
y"
    assert_equal "$(git_proxy_origin "$Plugin_Path")" "${presets[$i]}$base" 'batch change main origin'
    assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/a plugin")" "${presets[$i]}https://github.com/example/plugin.git" 'switch without stacking'
    assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/g-worktree")" "${presets[$i]}https://github.com/example/separate.git" 'worktree origin'
done
git_proxy_modify batch >"$test_tmp/idempotent" 2>&1 <<<'5'
[[ $(cat "$test_tmp/idempotent") == *'没有需要修改的仓库'* ]]
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/b-gitee")" 'https://gitee.com/example/plugin.git' 'skip Gitee'
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/c-ssh")" 'git@github.com:example/plugin.git' 'skip SSH'
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/f-token")" 'https://token@github.com/example/private.git' 'skip credentials'
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/e-multiple")" $'https://github.com/example/first.git\nhttps://github.com/example/second.git' 'skip multiple origins'
assert_equal "$(git -C "$Plugin_Path" config --get remote.upstream.url)" 'https://github.com/example/upstream.git' 'preserve other remotes'
assert_equal "$(git -C "$Plugin_Path" config --get remote.origin.pushurl)" 'git@github.com:example/bot.git' 'preserve explicit push URL'
assert_equal "$(cat "$GIT_CONFIG_GLOBAL")" "$global_before" 'preserve global config'

git_proxy_modify single >"$test_tmp/single" 2>&1 <<<'1
6
proxy.example/path'
assert_equal "$(git_proxy_origin "$Plugin_Path")" "https://proxy.example/path/$base" 'single custom prefix'
git_proxy_modify single >"$test_tmp/single" 2>&1 <<<'1
7'
assert_equal "$(git_proxy_origin "$Plugin_Path")" "$base" 'single removal'
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/a plugin")" 'https://ghfast.top/https://github.com/example/plugin.git' 'single leaves plugin alone'
git_proxy_modify batch >"$test_tmp/remove" 2>&1 <<<'7
y'
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/a plugin")" 'https://github.com/example/plugin.git' 'batch removal'
git_proxy_modify single >"$test_tmp/single" 2>&1 <<<'1
8
git@github.com:example/new.git'
assert_equal "$(git_proxy_origin "$Plugin_Path")" 'git@github.com:example/new.git' 'custom remote URL'

# 真实 Git 配置锁触发写入失败：如实返回非零，继续处理其他仓库。
git -C "$Plugin_Path" remote set-url origin "$base"
touch "$Plugin_Path/plugins/a plugin/.git/config.lock"
if git_proxy_modify batch >"$test_tmp/failed" 2>&1 <<<'5
y'; then
    echo 'FAIL batch write error reported success' >&2
    exit 1
fi
assert_equal "$(git_proxy_origin "$Plugin_Path/plugins/a plugin")" 'https://github.com/example/plugin.git' 'failed write preserves URL'
assert_equal "$(git_proxy_origin "$Plugin_Path")" "https://ghfast.top/$base" 'batch continues with writable repositories'
[[ $(cat "$test_tmp/failed") == *'失败 1 个'* ]]

# 菜单退出、EOF 和无效序号不产生写入。
if git_proxy_modify single >"$test_tmp/invalid" 2>&1 <<<'999999999999999999999999999999'; then
    echo 'FAIL invalid repository selection accepted' >&2
    exit 1
fi
change_github_proxy </dev/null >"$test_tmp/eof" 2>&1
change_github_proxy <<<'0' >"$test_tmp/exit" 2>&1
page=dialog_whiptail_page
dialog_whiptail=false
change_github_proxy >"$test_tmp/dialog-cancel" 2>&1
printf 'PASS: %s assertions plus menu, cancellation and failure checks\n' "$checks"

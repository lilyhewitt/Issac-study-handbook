#!/usr/bin/env bash
# Run every check: question banks, then the browser tests against a local build and a mock sync database.
#   tests/run.sh          all tests
#   tests/run.sh quick    banks + bar lessons + saves only
# Needs node with playwright. "saves" opens a save made by the last committed version in the new build:
# run it before every deploy, so progress already on the child's iPad keeps working.
set -u
cd "$(dirname "$0")/.."
T=$(mktemp -d); trap 'kill $(jobs -p) 2>/dev/null; rm -rf "$T"; rm -f bar-build.png bar-done-*.png phone-transfer.png' EXIT
fail=0
run(){ echo "== $1"; shift; out=$("$@" 2>&1 | grep -v -E "agent-proxy|fonts.googleapis|Allowed domains|For details"); echo "$out" | grep -E "^(FAIL|PASS)|bad|errors|cut off|Error" | grep -v "^PASS" ; echo "   $(echo "$out" | grep -c '^PASS') passed, $(echo "$out" | grep -c '^FAIL') failed"; echo "$out" | grep -q -E "^FAIL|Error:|errors \[[^]]" && fail=1; }

python3 tools/build.py >/dev/null || exit 1
git diff --quiet -- english science math || echo "note: built apps differ from the committed ones (expected if you changed src/)"
echo "== question banks"
node tests/check-english.js english/index.html | grep -E "^generators|^phrases|bad" | head -6
node tests/check-science.js src/science/bank.js | grep -E "^questions" | cut -c1-60
node tests/check-math.js src/math/bank.js | grep "^generators"

# test site: the same build pointed at the mock database; old/ = last commit, new/ = this build
python3 tools/build.py --db http://localhost:8766 --out "$T/site" >/dev/null
sed 's#var SYNC_DB="[^"]*"#var SYNC_DB="http://localhost:8766"#' index.html > "$T/site/index.html"
mkdir -p "$T/compat/old" "$T/compat/new"
for a in english science math; do git show HEAD:$a/index.html > "$T/compat/old/$a.html"; cp $a/index.html "$T/compat/new/$a.html"; done
git show HEAD:index.html > "$T/compat/old/hb.html"; cp index.html "$T/compat/new/hb.html"
for port in 8766 8767 8770; do pid=$(lsof -ti tcp:$port 2>/dev/null || fuser $port/tcp 2>/dev/null); [ -n "$pid" ] && kill $pid 2>/dev/null; done; sleep 0.5
node tests/mockfb.js >/dev/null 2>&1 &
python3 -m http.server 8767 --directory "$T/site" >/dev/null 2>&1 &
python3 -m http.server 8770 --directory "$T/compat" >/dev/null 2>&1 &
sleep 1.5
curl -sf -o /dev/null localhost:8767/math/ || { echo "test site did not start"; exit 1; }

run "bar-model lessons" node tests/bar-lessons.js
run "saves from the last version" node tests/saves.js
if [ "${1:-}" != quick ]; then
  run "bar-model pictures (nothing cut off)" node tests/bar-pictures.js
  run "sync" node tests/sync.js
  run "chapter chosen in the handbook" node tests/chapter.js
  run "daily rounds" node tests/rounds.js
  run "English phrases and grammar" node tests/phrases.js
fi
[ $fail = 0 ] && echo "ALL OK" || { echo "SOMETHING FAILED"; exit 1; }

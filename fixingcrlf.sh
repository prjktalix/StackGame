#!/usr/bin/env bash

unwindows() {

  local errmsg
  local fpath

  # base case
  errmsg="$(git add . 2>&1)"
  if [[ $? -eq 0 ]]; then
    echo 'Successfully converted CRLF to LF in all files.'
    echo 'Successfully ran "git add .".'
    echo 'Done.'
    return 0
  fi

  fpath="${errmsg#*fatal: CRLF would be replaced by LF in }"
  fpath="${fpath%.*}"

  if [[ "${fpath}" == "${errmsg}" ]]; then
    err 'Regex failed. Could not auto-generate filename from stderr.'
    return 1
  fi

  if [[ ! -e "${fpath}" ]]; then
    err "Regex failed. '${fpath}' does not exist."
    return 1
  fi

  if ! dos2unix "${fpath}"; then
    err "Failed to run \"dos2unix '${fpath}'\"."
    return 1
  fi

  # recursive case
  unwindows
}

err() {
  local -r msg="$1"
  echo "${msg}" >&2
}

unwindows
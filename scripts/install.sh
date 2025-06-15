#!/usr/bin/env bash

# Fail-safe bash mode
if [ -n "$BASH_VERSION" ]; then
  set -euo pipefail
else
  set -eu
fi

# === Konfiguration ===
REPO_URL="https://git.0xmax42.io/maxp/systemd-timer/releases/download/latest"
BINARY_NAME="systemd-timer"
INSTALL_PATH="/usr/local/bin"

# === Systemarchitektur erkennen ===
ARCH=$(uname -m)
case "$ARCH" in
  x86_64) ARCH="amd64" ;;
  aarch64 | arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
esac

OS=$(uname -s)
case "$OS" in
  Linux) OS="linux" ;;
  *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
esac

# === Datei- und URL-Namen ===
BASE_NAME="${BINARY_NAME}-${OS}-${ARCH}"
ZST_NAME="${BASE_NAME}.zst"
ZST_URL="${REPO_URL}/${ZST_NAME}"
BIN_URL="${REPO_URL}/${BASE_NAME}"

echo "📦 Installing ${BINARY_NAME} for ${OS}/${ARCH}..."

USE_ZSTD=false
if command -v zstd >/dev/null; then
  echo "✅ 'zstd' found – will use compressed .zst archive"
  USE_ZSTD=true
fi

TMP_DIR=$(mktemp -d)
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

if [ "$USE_ZSTD" = true ]; then
  echo "🌐 Downloading: ${ZST_URL}"
  curl -fsSL "$ZST_URL" -o "$TMP_DIR/${ZST_NAME}"
  echo "🌐 Downloading checksum: ${ZST_URL}.sha256"
  curl -fsSL "$ZST_URL.sha256" -o "$TMP_DIR/zst.sha256"

  EXPECTED_HASH=$(cut -d ' ' -f1 "$TMP_DIR/zst.sha256")
  ACTUAL_HASH=$(openssl dgst -sha256 "$TMP_DIR/${ZST_NAME}" | awk '{print $2}')

  if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
    echo "⚠️ Checksum mismatch for .zst archive!"
    echo "Expected: $EXPECTED_HASH"
    echo "Actual:   $ACTUAL_HASH"
    exit 1
  fi

  echo "📥 Decompressing..."
  zstd -d -q "$TMP_DIR/${ZST_NAME}" -o "$TMP_DIR/${BASE_NAME}"
  TMP_FILE="$TMP_DIR/${BASE_NAME}"

else
  echo "🌐 Downloading uncompressed binary: ${BIN_URL}"
  curl -fsSL "$BIN_URL" -o "$TMP_DIR/${BASE_NAME}"
  echo "🌐 Downloading checksum: ${BIN_URL}.sha256"
  curl -fsSL "$BIN_URL.sha256" -o "$TMP_DIR/binary.sha256"

  EXPECTED_HASH=$(cut -d ' ' -f1 "$TMP_DIR/binary.sha256")
  ACTUAL_HASH=$(openssl dgst -sha256 "$TMP_DIR/${BASE_NAME}" | awk '{print $2}')

  if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
    echo "⚠️ Checksum mismatch!"
    echo "Expected: $EXPECTED_HASH"
    echo "Actual:   $ACTUAL_HASH"
    exit 1
  fi

  TMP_FILE="$TMP_DIR/${BASE_NAME}"
fi

chmod +x "$TMP_FILE"
echo "🚀 Installing to ${INSTALL_PATH}/${BINARY_NAME}"
if [ -w "$INSTALL_PATH" ]; then
  install -m 755 "$TMP_FILE" "${INSTALL_PATH}/${BINARY_NAME}"
else
  sudo install -m 755 "$TMP_FILE" "${INSTALL_PATH}/${BINARY_NAME}"
fi

echo "✅ Installation complete: $(command -v ${BINARY_NAME})"
"${BINARY_NAME}" --version || true

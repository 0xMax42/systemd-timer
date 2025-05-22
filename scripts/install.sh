#!/usr/bin/env bash

# Fail-safe bash mode (only if bash is used)
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

# === Download-URL zusammensetzen ===
BINARY_FILE="${BINARY_NAME}-${OS}-${ARCH}"
DOWNLOAD_URL="${REPO_URL}/${BINARY_FILE}"

echo "📦 Installing ${BINARY_NAME} for ${OS}/${ARCH}..."
echo "🌐 Downloading from: ${DOWNLOAD_URL}"

# === Binary herunterladen ===
TMP_FILE=$(mktemp)
curl -fsSL "${DOWNLOAD_URL}" -o "${TMP_FILE}"
chmod +x "${TMP_FILE}"

# === SHA256-Check ===
TMP_HASH=$(mktemp)
curl -fsSL "${DOWNLOAD_URL}.sha256" -o "$TMP_HASH"
EXPECTED_HASH=$(cut -d ' ' -f1 "$TMP_HASH")
ACTUAL_HASH=$(openssl dgst -sha256 "$TMP_FILE" | awk '{print $2}')

if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
  echo "⚠️ Checksum mismatch!"
  echo "Expected: $EXPECTED_HASH"
  echo "Actual:   $ACTUAL_HASH"
  exit 1
fi

# === Installation ===
echo "🚀 Installing to ${INSTALL_PATH}/${BINARY_NAME}"
if [ -w "$INSTALL_PATH" ]; then
  install -m 755 "${TMP_FILE}" "${INSTALL_PATH}/${BINARY_NAME}"
else
  sudo install -m 755 "${TMP_FILE}" "${INSTALL_PATH}/${BINARY_NAME}"
fi

echo "✅ Installation complete: $(command -v ${BINARY_NAME})"
"${BINARY_NAME}" --version || true
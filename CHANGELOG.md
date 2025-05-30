# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### 🧪 Testing

- *(fs)* Update test descriptions and comments to English - ([c4f4614](https://git.0xmax42.io/maxp/systemd-timer/commit/c4f4614a2daee68f9b33b9676106214c65a1a427))
- *(fs)* Add rollback tests for writeUnitFiles errors - ([6039d23](https://git.0xmax42.io/maxp/systemd-timer/commit/6039d236eb7de449ce22b1d9ea718389a3e2261d))

## [0.4.1](https://git.0xmax42.io/maxp/systemd-timer/compare/v0.4.0..v0.4.1) - 2025-05-28

### 🐛 Bug Fixes

- *(tasks)* Add read permissions to build scripts - ([a22c156](https://git.0xmax42.io/maxp/systemd-timer/commit/a22c156dd3d2cf4a24f0eed699f7dfabfae3837a))

## [0.4.0](https://git.0xmax42.io/maxp/systemd-timer/compare/v0.3.1..v0.4.0) - 2025-05-28

### 🚀 Features

- *(vscode)* Enable Deno support and configure JSON formatting - ([c02da70](https://git.0xmax42.io/maxp/systemd-timer/commit/c02da709028e1fbb175d5091fbd9d3ed2940cdcd))
- *(ci)* Add CI workflow with format, lint, and test steps - ([9ad407e](https://git.0xmax42.io/maxp/systemd-timer/commit/9ad407e531270445d9657402fa3e826a7dabd880))
- *(tasks)* Add formatting, linting, and CI tasks - ([07730e5](https://git.0xmax42.io/maxp/systemd-timer/commit/07730e576180be3f6a16b0fda6c6554a86844eee))
- *(tasks)* Include localization files in build commands - ([440130f](https://git.0xmax42.io/maxp/systemd-timer/commit/440130f782b1fc51053164410ead29397b867892))
- *(i18n)* Add German and English translations for CLI tool - ([bd5ea80](https://git.0xmax42.io/maxp/systemd-timer/commit/bd5ea80aff5092118920ea897af6c3f5f9fb2a3b))
- *(i18n)* Add i18n module for localization support - ([c9b4c8b](https://git.0xmax42.io/maxp/systemd-timer/commit/c9b4c8bd71029976fe900b40a2297b52200a216b))

### 🚜 Refactor

- *(cli)* Integrate i18n support across commands - ([2a13ee2](https://git.0xmax42.io/maxp/systemd-timer/commit/2a13ee2539d96d161a9ee398629fa79822d856f2))

### 🎨 Styling

- *(i18n)* Add missing newline at EOF in JSON files - ([54d71ba](https://git.0xmax42.io/maxp/systemd-timer/commit/54d71ba3f00ced25313036d9f10f6fb01feba52a))

### 🧪 Testing

- *(i18n)* Add unit tests for localization functions - ([8efbee1](https://git.0xmax42.io/maxp/systemd-timer/commit/8efbee1ba9b4fc564f5a32fcbc101ff256c5555b))

### ⚙️ Miscellaneous Tasks

- *(vscode)* Update folder listener with i18n directory - ([dfa92d8](https://git.0xmax42.io/maxp/systemd-timer/commit/dfa92d80694b5b104c26e131d1ee7c5cf69ad94c))

## [0.3.1](https://git.0xmax42.io/maxp/systemd-timer/compare/v0.2.3..v0.3.1) - 2025-05-28

### 🚀 Features

- *(cli)* Add options for user, home, and working directory - ([113103f](https://git.0xmax42.io/maxp/systemd-timer/commit/113103f368ead3014165cc708f016a04749f59be))

### 📚 Documentation

- *(readme)* Expand CLI option descriptions for clarity - ([fb2a62d](https://git.0xmax42.io/maxp/systemd-timer/commit/fb2a62d984615caa4035fd5c1e8e64d245499e47))

### 🎨 Styling

- *(workflows)* Fix formatting and whitespace issues - ([c4855ed](https://git.0xmax42.io/maxp/systemd-timer/commit/c4855ed3fbc0ada208690f90932710983daef392))

### ⚙️ Miscellaneous Tasks

- *(workflows)* Consolidate release sync into upload workflow - ([0c1d8be](https://git.0xmax42.io/maxp/systemd-timer/commit/0c1d8be79f0cc331db9029beb46384659f465f6e))

## [0.2.3](https://git.0xmax42.io/maxp/systemd-timer/compare/v0.2.2..v0.2.3) - 2025-05-26

### 🚀 Features

- *(workflows)* Add GitHub release synchronization workflow - ([27c7367](https://git.0xmax42.io/maxp/systemd-timer/commit/27c7367ef1799428cc5a491b25036f77b65758af))

### 📚 Documentation

- *(readme)* Update project time badge interval - ([e3a3e61](https://git.0xmax42.io/maxp/systemd-timer/commit/e3a3e61bce0e62c2397bbc5bde3eff81b915c94a))
- Add Englisch README - ([cf483de](https://git.0xmax42.io/maxp/systemd-timer/commit/cf483de06b555599052b1d9f97ee98e9233e5a86))

## [0.2.2](https://git.0xmax42.io/maxp/systemd-timer/compare/v0.2.0..v0.2.2) - 2025-05-22

### 🐛 Bug Fixes

- *(install)* Enhance checksum validation with detailed comparison - ([0ca8ed9](https://git.0xmax42.io/maxp/systemd-timer/commit/0ca8ed94ccc4b9fe4ccac331957f01f852999094))
- *(install)* Ensure compatibility with non-bash shells - ([20d1430](https://git.0xmax42.io/maxp/systemd-timer/commit/20d143035ec6893f680b68dc4a2f6319ca7a5b81))

### 📚 Documentation

- *(readme)* Update installation instructions with script - ([9853f85](https://git.0xmax42.io/maxp/systemd-timer/commit/9853f854c991d87b12cd4fb5e19fce55e7246024))

## [0.2.0](https://git.0xmax42.io/maxp/systemd-timer/compare/v0.1.0..v0.2.0) - 2025-05-22

### 🚀 Features

- *(scripts)* Add installation script for systemd-timer binary - ([264b43c](https://git.0xmax42.io/maxp/systemd-timer/commit/264b43c9a667d344e27cca4ac2f17d7a4a25bffc))
- *(workflows)* Add matrix build and SHA256 generation for releases - ([118e4e5](https://git.0xmax42.io/maxp/systemd-timer/commit/118e4e5a867a42c0d79efcc3b2a4db188affedec))
- *(tasks)* Add build tasks for amd64 and arm64 targets - ([01898a3](https://git.0xmax42.io/maxp/systemd-timer/commit/01898a3a8e094dfbbf981ab6f1cf38d52f60ef5d))

### 🐛 Bug Fixes

- *(utils)* Handle file write failures with rollback - ([bd71b8e](https://git.0xmax42.io/maxp/systemd-timer/commit/bd71b8ee14a1856f1adaaaea198c8467b1a00d24))

### 📚 Documentation

- *(readme)* Add project time badge - ([a288dbc](https://git.0xmax42.io/maxp/systemd-timer/commit/a288dbc140fefbc46745f70cdcd71148802fdabf))

## [0.1.0] - 2025-05-21

### 🚀 Features

- *(workflows)* Add release asset upload workflow - ([1012ca5](https://git.0xmax42.io/maxp/systemd-timer/commit/1012ca53781c36131a8b7aa43a9134f7b8565599))
- *(cli)* Use dynamic version retrieval - ([403e047](https://git.0xmax42.io/maxp/systemd-timer/commit/403e047c0c376229244a5605d5c52eb1699acd4a))
- *(utils)* Add version retrieval utility - ([56fb554](https://git.0xmax42.io/maxp/systemd-timer/commit/56fb554f132a53d74b2e9a1a02cc973c5420e73c))
- *(generator)* Add systemctl usage instructions - ([f81bb53](https://git.0xmax42.io/maxp/systemd-timer/commit/f81bb533536810fc34656d572369b94ab669a181))
- *(cli)* Add command to generate systemd unit files - ([97dc3fe](https://git.0xmax42.io/maxp/systemd-timer/commit/97dc3fe23acf2c35053aced7b34918bab7778c35))
- *(utils)* Export utility functions for filesystem and naming - ([428e849](https://git.0xmax42.io/maxp/systemd-timer/commit/428e84927f8a9a379fa014ea763dd61115be34d6))
- *(types)* Add TimerOptions interface for timer configuration - ([ba4b933](https://git.0xmax42.io/maxp/systemd-timer/commit/ba4b933f78c48a52b1c199fe28dc82d7ebabd7fe))
- *(cli)* Add entry point for CLI commands - ([d5a383a](https://git.0xmax42.io/maxp/systemd-timer/commit/d5a383a62c965b60de7429ac1cb89f02639935f6))
- *(utils)* Add function to derive sanitized job names - ([9539fe0](https://git.0xmax42.io/maxp/systemd-timer/commit/9539fe053245e9fea10ceda0e46fe61e9de80797))

### 🚜 Refactor

- *(utils)* Update import path for TimerOptions - ([316f3af](https://git.0xmax42.io/maxp/systemd-timer/commit/316f3af04ef7fe4c08963cfe3ad7780ed3bc262c))

### 📚 Documentation

- Add README for systemd-timer CLI tool - ([db1f56c](https://git.0xmax42.io/maxp/systemd-timer/commit/db1f56c539309b8a02adff114d765c725ac5ff8a))
- Add MIT license file - ([e1cd5df](https://git.0xmax42.io/maxp/systemd-timer/commit/e1cd5dfd353c7cd7ca770daae5fc40405e461d1d))

### 🧪 Testing

- *(generate)* Add unit tests for service and timer generation - ([569b14d](https://git.0xmax42.io/maxp/systemd-timer/commit/569b14d57432589107a0f33e52881b605c5f79f9))
- *(utils)* Add unit tests for systemd file handling - ([ef2ac41](https://git.0xmax42.io/maxp/systemd-timer/commit/ef2ac416d92f59efe3390317af46e943549adc47))

### ⚙️ Miscellaneous Tasks

- *(tasks)* Include version file in build process - ([6e00e89](https://git.0xmax42.io/maxp/systemd-timer/commit/6e00e89bb086672b9c3276ffeebcb1ded28c836f))
- Add VSCode settings for color customizations and folder listener - ([6608f48](https://git.0xmax42.io/maxp/systemd-timer/commit/6608f488405adefc7993f47a137a824e5de62154))
- *(config)* Add deno configuration and lockfile - ([0b72050](https://git.0xmax42.io/maxp/systemd-timer/commit/0b720500e0fe34db087b3277c38fa6bb07875e80))
- Add automated release workflow and scripts for version management - ([a058e7b](https://git.0xmax42.io/maxp/systemd-timer/commit/a058e7b6838d41a98f3269db9a9d1e31f752121f))
- *(gitignore)* Add dist/ and .env files to ignore list - ([2da372d](https://git.0xmax42.io/maxp/systemd-timer/commit/2da372d20dd0e023feb7e2da391dd0971da6a73d))
- *(gitignore)* Add common build and coverage directories - ([2990af3](https://git.0xmax42.io/maxp/systemd-timer/commit/2990af3628b036c1d61daaf3d8efd3d2f0d4b761))



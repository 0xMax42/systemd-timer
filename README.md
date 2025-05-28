# systemd-timer

- ![Project time](https://waka.0xmax42.io/api/badge/0XMax42/interval:any/project:systemd-timer?label=Project%20time)
- [Deutsche Version dieser Readme](README.DE.md)

A simple CLI tool for quickly generating systemd `.service` and `.timer` units — as a replacement or modern supplement to classic `cron` jobs.

---

## 🚀 Features

* Generates `.service` and `.timer` files via CLI
* Supports `--user` timers (for `~/.config/systemd/user/`)
* Optional logging (`StandardOutput/StandardError`)
* Supports:
  * `--calendar`: Timer schedule (systemd `OnCalendar`)
  * `--exec`: Command to execute (`ExecStart`)
  * `--description`: Description for the unit
  * `--after`: `After=` dependencies in the service unit
  * `--environment`: Arbitrary `Environment=KEY=VALUE` entries
  * `--output`: Target directory for the generated unit files
  * `--run-as`: Sets `User=` in the service unit (only for system-level timers)
  * `--home`: Sets `Environment=HOME=…`
  * `--cwd`: Working directory for the process (`WorkingDirectory`)
  * `--dry-run`: Outputs unit content without writing to disk
* Tested and fully typed with **Deno** + **Cliffy**

---

## 🛠️ Installation

You can install `systemd-timer` directly via shell script:

```bash
curl -fsSL https://git.0xmax42.io/maxp/systemd-timer/raw/branch/main/scripts/install.sh | sh
```

The script automatically detects your platform (Linux `amd64` or `arm64`) and installs the appropriate binary to `/usr/local/bin`, if permitted (possibly using `sudo`).

**Note:**

* A working internet connection is required for installation.
* The integrity of the binary is verified using a SHA256 checksum.
* You can manually inspect the script before execution:

```bash
curl -fsSL https://git.0xmax42.io/maxp/systemd-timer/raw/branch/main/scripts/install.sh -o install.sh
less install.sh
```

Additional options and manual installation methods are available under [`scripts/install.sh`](scripts/install.sh).

---

## 📦 Example

```bash
./systemd-timer create \
  --exec "/usr/local/bin/backup.sh" \
  --calendar "Mon..Fri 02:00" \
  --description "Backup Job" \
  --user \
  --logfile "/var/log/backup.log"
```

This creates:

* `~/.config/systemd/user/backup.service`
* `~/.config/systemd/user/backup.timer`

Activate afterwards:

```bash
systemctl --user daemon-reload
systemctl --user enable --now backup.timer
```

---

## 🧪 Running Tests

```bash
deno task test
```

---

## 🧰 Development

```bash
deno task start create --exec "/bin/true" --calendar "daily" --dry-run
```

---

## 🔒 Permissions / Flags

The tool requires the following permissions when running or compiling:

* `--allow-env` (for `$HOME`)
* `--allow-write` (to write `.service`/`.timer` files)

During development, usually `-A` (allow all) is used.

---

## 📝 License

[MIT License](LICENSE)

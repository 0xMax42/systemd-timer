# systemd-timer

![Project time](https://waka.0xmax42.io/api/badge/0XMax42/interval:today/project:systemd-timer?label=Project%20time)

Ein einfaches CLI-Tool zum schnellen Erzeugen von systemd `.service` und `.timer` Units – als Ersatz oder moderne Ergänzung zu klassischen `cron`-Jobs.

---

## 🚀 Features

- Erzeugt `.service` und `.timer` Dateien per CLI
- Unterstützt `--user` Timer (für `~/.config/systemd/user/`)
- Optionales Logging (`StandardOutput/StandardError`)
- Unterstützt:
  - `--calendar`
  - `--exec`
  - `--after`
  - `--environment`
  - `--output`
  - `--dry-run`
- Getestet und typisiert mit Deno + Cliffy

---

## 🛠️ Installation

```bash
git clone https://git.0xmax42.io/maxp/systemd-timer.git
cd systemd-timer
deno task build

# Binary liegt nun unter ./systemd-timer
./systemd-timer --help
```

---

## 📦 Beispiel

```bash
./systemd-timer create \
  --exec "/usr/local/bin/backup.sh" \
  --calendar "Mon..Fri 02:00" \
  --description "Backup Job" \
  --user \
  --logfile "/var/log/backup.log"
```

Erzeugt:
- `~/.config/systemd/user/backup.service`
- `~/.config/systemd/user/backup.timer`

Anschließend aktivieren:

```bash
systemctl --user daemon-reload
systemctl --user enable --now backup.timer
```

---

## 🧪 Tests ausführen

```bash
deno task test
```

---

## 🧰 Entwickeln

```bash
deno task start create --exec "/bin/true" --calendar "daily" --dry-run
```

---

## 🔒 Rechte / Flags

Das Tool benötigt beim Ausführen bzw. Kompilieren:

- `--allow-env` (für `$HOME`)
- `--allow-write` (zum Schreiben von `.service`/`.timer`)

Beim Entwickeln wird meist `-A` (allow all) verwendet.

---

## 📝 Lizenz

[MIT License](LICENSE)

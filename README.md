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


Du kannst `systemd-timer` direkt per Shell-Skript installieren:

```bash
curl -fsSL https://git.0xmax42.io/maxp/systemd-timer/raw/branch/main/scripts/install.sh | sh
```

Das Skript erkennt automatisch deine Plattform (Linux `amd64` oder `arm64`) und installiert die passende Binary nach `/usr/local/bin`, sofern dies erlaubt ist (ggf. mit `sudo`).

**Hinweis:**
- Für die Installation ist eine funktionierende Internetverbindung notwendig.
- Die Integrität der Binary wird mittels SHA256-Prüfsumme verifiziert.
- Du kannst das Skript vor der Ausführung auch manuell inspizieren:

```bash
curl -fsSL https://git.0xmax42.io/maxp/systemd-timer/raw/branch/main/scripts/install.sh -o install.sh
less install.sh
```

Weitere Optionen und manuelle Installationswege findest du unter [`scripts/install.sh`](scripts/install.sh).

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

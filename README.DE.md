# systemd-timer

![Project time](https://waka.0xmax42.io/api/badge/0XMax42/interval:any/project:systemd-timer?label=Project%20time)

Ein einfaches CLI-Tool zum schnellen Erzeugen von systemd `.service` und `.timer` Units – als Ersatz oder moderne Ergänzung zu klassischen `cron`-Jobs.

---

## 🚀 Features

- Erzeugt `.service` und `.timer` Dateien per CLI
- Unterstützt `--user` Timer (für `~/.config/systemd/user/`)
- Optionales Logging (`StandardOutput/StandardError`)
- Unterstützt:
  - `--calendar`: Zeitplan für den Timer (systemd `OnCalendar`)
  - `--exec`: Auszuführendes Kommando (`ExecStart`)
  - `--description`: Beschreibung für die Unit
  - `--after`: `After=`-Abhängigkeiten in der Service-Unit
  - `--environment`: Beliebige `Environment=KEY=VALUE` Einträge
  - `--output`: Zielverzeichnis für die generierten Unit-Dateien
  - `--run-as`: Setzt `User=` in der Service-Unit (nur systemweite Timer)
  - `--home`: Setzt `Environment=HOME=…`
  - `--cwd`: Arbeitsverzeichnis des Prozesses (`WorkingDirectory`)
  - `--dry-run`: Gibt nur die generierten Inhalte aus, ohne sie zu schreiben
- Getestet und typisiert mit **Deno** + **Cliffy**
- Eingaben werden validiert und auf Fehler geprüft;
  - z.B. muss `--calendar` ein gültiger systemd `OnCalendar` Ausdruck sein
- Mehrsprachig (Englisch, Deutsch)

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

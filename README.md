# Innkeeper

[![Lint and Test](https://github.com/dev-inn/innkeeper/actions/workflows/python-app.yml/badge.svg)](https://github.com/dev-inn/innkeeper/actions/workflows/python-app.yml)

Bot for the Developer’s Inn Discord server

## User Guide

### Command List

#### Prefix
?
#### `help` or `h`
Shows a list of available commands.
#### `award \<username>` or `a`
Awards a user with a reputation point
#### `reputation \<username>` or `r`
Get the reputation of a user.
#### `rank \<username>`
Get the rank of a user.
#### `leaderboard` or `l`
Shows a list of the top users by xp and reputation points.

---

### Admin Command List

#### `admin help`
Shows a list of admin commands.
#### `nuke`
Resets a users reputation back to 0
#### `setcredits \<username> <amount>`
Sets a users credits to specified amount.
#### `newrank <role> <entry_reputation>`
Create a new role for a given reputation level.

### Support

File an [issue](https://github.com/dev-inn/innkeeper/issues) here on Github.

## Developers

### Requirements

```
pip install -r requirements.txt
```

### Running

`python bot.py`

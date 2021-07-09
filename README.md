# Innkeeper


Bot for the Developer’s Inn Discord server

## User Guide

### Command List
*For a full list of commands do ?h in a server with the bot in*
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

#### `nuke`
Resets a users reputation back to 0
#### `setcredits \<username> <amount>`
Sets a users credits to specified amount.
#### `addrank <@role> <entry_reputation> <budget>`
Create a new role for a given reputation level.
#### `delrank <@rank>`
Create a new role for a given reputation level.
#### `setprefix <new_prefix>`
Create a new role for a given reputation level.

### Support

File an [issue](https://github.com/dev-inn/innkeeper/issues) here on Github. Or contact us on the Developer's Inn <a href="https://discord.gg/va3eAbg">Discord</a>

## Developers

### Requirements

```
npm install
```

### Running

`npm run start`

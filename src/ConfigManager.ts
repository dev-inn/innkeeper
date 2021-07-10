import * as fs from 'fs'
import { logger } from '@noodlewrecker7/logger'

const log = logger.Logger

/**Manages config file's data*/
export class ConfigManager {
  private data: { [key: string]: string } = {}
  private filepath: string

  /**Manages storage and retrieval of bot configurations
   * @param filepath path of json file to store config in*/
  constructor(filepath: string) {
    this.data = {}
    this.filepath = filepath
    this.read()
  }

  /**Gets data from given key
   * @param key the key for the desired data
   */
  get(key: string): string {
    const d = this.data[key]
    if (!d) {
      log.warn(`Could not find ${key}\nDid you make sure to set it in ${this.filepath}?`)
    }
    return d
  }

  /**Sets data to given key
   * @param key the key of the data to set
   * @param value the value to store
   */
  set(key: string, value: string): void {
    this.data[key] = value
    this.save()
  }

  /**
   * Writes all stored data to file*/
  save(): Promise<void> {
    return new Promise((res, rej) => {
      fs.writeFile(this.filepath, JSON.stringify(this.data), (err) => {
        if (err) {
          log.error('Error writing to json config')
          log.trace()
          rej()
          throw err
        }
        log.info('Saved config to json')
        res()
      })
    })
  }

  /**
   * Will overwrite any stored data with that loaded from file*/
  read(): void {
    let response
    try {
      response = fs.readFileSync(this.filepath)
    } catch (e) {
      log.warn('Could not find config file, creating new one')
      this.data = default_data
      this.save()
      return
    }
    this.data = JSON.parse(response.toString())

    for (let i = 0; i < Object.keys(default_data).length; i++) {
      if (!this.data[Object.keys(default_data)[i]]) {
        this.data[Object.keys(default_data)[i]] = default_data[Object.keys(default_data)[i]]
      }
    }
  }
}

const default_data: { [key: string]: string } = {
  debug: 'False',
  prefix: '?',
  pfp: 'https://files.noodlewrecker.net/innkeeper.png',
  gh_link: 'https://github.com/dev-inn/innkeeper',
  token: '<PUT_YOUR_TOKEN_HERE>',
  scheduler_interval: '21600',
  dbfile: 'reputation',
  dbdir: 'data',
  server_cache_limit: '5',
  bot_name: 'Innkeeper'
}

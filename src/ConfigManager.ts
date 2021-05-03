import * as fs from 'fs'
import { logger } from '@noodlewrecker7/logger'

const log = logger.Logger

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

    get(key: string): string {
        const d = this.data[key]
        if (!d) {
            log.warn(
                `Could not find ${key}\nDid you make sure to set it in ${this.filepath}?`
            )
        }
        return d
    }

    set(key: string, value: string) {
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
    read() {
        let response
        try {
            response = fs.readFileSync(this.filepath)
        } catch (e) {
            log.error('Error reading from json config')
            return
        }
        try {
            this.data = JSON.parse(response.toString())
        } catch (e) {
            this.data = default_data
            this.save()
            return
        }
    }
}

const default_data = {
    debug: 'False',
    prefix: '?',
    pfp: 'avatar.jpg',
    gh_link: 'https://github.com/dev-inn/innkeeper',
    token: '<PUT_YOUR_TOKEN_HERE>',
    schedulerInterval: '21600',
    dbfile: 'reputation',
    controller_role: '<PUT_YOUR_ROLE_ID_HERE>',
    dbdir: 'data',
    server_cache_limit: '5'
}
